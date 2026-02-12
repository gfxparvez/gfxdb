import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loadDB, saveDB, generateId, DatabaseRecord, TableRecord, ColumnRecord } from "@/lib/mainwebdb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, ArrowLeft, Table2 } from "lucide-react";
import { Link } from "react-router-dom";

type ColumnInput = { name: string; data_type: string; is_nullable: boolean; default_value: string };
const DATA_TYPES = ["text", "integer", "boolean", "timestamp", "uuid", "jsonb", "float"];

const DatabaseDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [currentDb, setCurrentDb] = useState<DatabaseRecord | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [tableName, setTableName] = useState("");
  const [columns, setColumns] = useState<ColumnInput[]>([{ name: "", data_type: "text", is_nullable: true, default_value: "" }]);

  const refresh = () => {
    if (!user || !id) return;
    const db = loadDB();
    const found = db.databases.find(d => d.id === id && d.user_id === user.id);
    setCurrentDb(found || null);
    if (!found) navigate("/databases");
  };

  useEffect(() => { refresh(); }, [id, user]);

  const addColumn = () => setColumns([...columns, { name: "", data_type: "text", is_nullable: true, default_value: "" }]);
  const removeColumn = (i: number) => setColumns(columns.filter((_, idx) => idx !== i));
  const updateColumn = (i: number, field: keyof ColumnInput, value: string | boolean) => {
    const updated = [...columns];
    (updated[i] as any)[field] = value;
    setColumns(updated);
  };

  const handleCreateTable = () => {
    if (!user || !id || !tableName.trim()) return;
    const validCols = columns.filter(c => c.name.trim());
    if (validCols.length === 0) { toast({ title: "Add at least one column", variant: "destructive" }); return; }

    const db = loadDB();
    const dbIdx = db.databases.findIndex(d => d.id === id);
    if (dbIdx < 0) return;

    const newTable: TableRecord = {
      id: generateId(), name: tableName.trim(),
      columns: validCols.map((c, i) => ({
        id: generateId(), name: c.name.trim(), data_type: c.data_type,
        is_nullable: c.is_nullable, default_value: c.default_value || null, position: i,
      })),
      rows: [], created_at: new Date().toISOString(),
    };
    db.databases[dbIdx].tables.push(newTable);
    saveDB(db);
    toast({ title: "Table created!" });
    setTableName(""); setColumns([{ name: "", data_type: "text", is_nullable: true, default_value: "" }]); setCreateOpen(false);
    refresh();
  };

  const handleDeleteTable = (tableId: string) => {
    const db = loadDB();
    const dbIdx = db.databases.findIndex(d => d.id === id);
    if (dbIdx < 0) return;
    db.databases[dbIdx].tables = db.databases[dbIdx].tables.filter(t => t.id !== tableId);
    saveDB(db);
    toast({ title: "Table deleted" });
    refresh();
  };

  if (!currentDb) return null;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => navigate("/databases")}><ArrowLeft className="w-5 h-5" /></Button>
        <div>
          <h1 className="text-2xl font-bold">{currentDb.name}</h1>
          <p className="text-muted-foreground text-sm">{currentDb.description || "Manage tables in this database"}</p>
        </div>
      </div>

      <div className="flex justify-end">
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> New Table</Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create Table</DialogTitle>
              <DialogDescription>Define your table name and columns.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Table Name</Label><Input value={tableName} onChange={(e) => setTableName(e.target.value)} placeholder="users" /></div>
              <div className="space-y-2">
                <Label>Columns</Label>
                {columns.map((col, i) => (
                  <div key={i} className="flex items-center gap-2 flex-wrap">
                    <Input className="flex-1 min-w-[120px]" placeholder="Column name" value={col.name} onChange={(e) => updateColumn(i, "name", e.target.value)} />
                    <Select value={col.data_type} onValueChange={(v) => updateColumn(i, "data_type", v)}>
                      <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>{DATA_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                    </Select>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Switch checked={col.is_nullable} onCheckedChange={(v) => updateColumn(i, "is_nullable", v)} />
                      <span>Null</span>
                    </div>
                    {columns.length > 1 && <Button variant="ghost" size="icon" onClick={() => removeColumn(i)}><Trash2 className="w-4 h-4 text-destructive" /></Button>}
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={addColumn}><Plus className="w-3 h-3" /> Add Column</Button>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreateTable} disabled={!tableName.trim()} className="gradient-primary text-primary-foreground">Create Table</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {currentDb.tables.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center py-12">
            <Table2 className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No tables yet. Create one to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Table Name</TableHead>
                <TableHead>Columns</TableHead>
                <TableHead>Rows</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentDb.tables.map((t) => (
                <TableRow key={t.id}>
                  <TableCell className="font-medium">{t.name}</TableCell>
                  <TableCell>{t.columns.length}</TableCell>
                  <TableCell>{t.rows.length}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(t.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete table "{t.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>This will delete all data in this table.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteTable(t.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default DatabaseDetail;
