import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loadDB, saveDB, generateId, DatabaseRecord, TableRecord, RowRecord, ColumnRecord } from "@/lib/mainwebdb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Save, Table2 } from "lucide-react";

const DataExplorer = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [databases, setDatabases] = useState<DatabaseRecord[]>([]);
  const [selectedDb, setSelectedDb] = useState("");
  const [selectedTable, setSelectedTable] = useState("");
  const [currentTable, setCurrentTable] = useState<TableRecord | null>(null);
  const [addOpen, setAddOpen] = useState(false);
  const [newRow, setNewRow] = useState<Record<string, string>>({});
  const [editingRow, setEditingRow] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!user) return;
    const db = loadDB();
    setDatabases(db.databases.filter(d => d.user_id === user.id));
  }, [user]);

  const tables = databases.find(d => d.id === selectedDb)?.tables || [];

  useEffect(() => {
    if (!selectedTable) { setCurrentTable(null); return; }
    const db = loadDB();
    const dbRec = db.databases.find(d => d.id === selectedDb);
    const tbl = dbRec?.tables.find(t => t.id === selectedTable);
    setCurrentTable(tbl || null);
  }, [selectedTable, selectedDb]);

  const refresh = () => {
    const db = loadDB();
    const dbRec = db.databases.find(d => d.id === selectedDb);
    const tbl = dbRec?.tables.find(t => t.id === selectedTable);
    setCurrentTable(tbl ? { ...tbl } : null);
    setDatabases(db.databases.filter(d => d.user_id === user!.id));
  };

  const handleAddRow = () => {
    if (!selectedDb || !selectedTable) return;
    const db = loadDB();
    const dbIdx = db.databases.findIndex(d => d.id === selectedDb);
    const tblIdx = db.databases[dbIdx]?.tables.findIndex(t => t.id === selectedTable);
    if (dbIdx < 0 || tblIdx < 0) return;

    const row: RowRecord = {
      id: generateId(), data: { ...newRow },
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    db.databases[dbIdx].tables[tblIdx].rows.push(row);
    saveDB(db);
    toast({ title: "Row added" });
    setNewRow({}); setAddOpen(false);
    refresh();
  };

  const handleSaveEdit = (rowId: string) => {
    const db = loadDB();
    const dbIdx = db.databases.findIndex(d => d.id === selectedDb);
    const tblIdx = db.databases[dbIdx]?.tables.findIndex(t => t.id === selectedTable);
    if (dbIdx < 0 || tblIdx < 0) return;
    const rowIdx = db.databases[dbIdx].tables[tblIdx].rows.findIndex(r => r.id === rowId);
    if (rowIdx < 0) return;
    db.databases[dbIdx].tables[tblIdx].rows[rowIdx].data = { ...editData };
    db.databases[dbIdx].tables[tblIdx].rows[rowIdx].updated_at = new Date().toISOString();
    saveDB(db);
    toast({ title: "Row updated" });
    setEditingRow(null);
    refresh();
  };

  const handleDeleteRow = (rowId: string) => {
    const db = loadDB();
    const dbIdx = db.databases.findIndex(d => d.id === selectedDb);
    const tblIdx = db.databases[dbIdx]?.tables.findIndex(t => t.id === selectedTable);
    if (dbIdx < 0 || tblIdx < 0) return;
    db.databases[dbIdx].tables[tblIdx].rows = db.databases[dbIdx].tables[tblIdx].rows.filter(r => r.id !== rowId);
    saveDB(db);
    toast({ title: "Row deleted" });
    refresh();
  };

  const startEdit = (row: RowRecord) => {
    setEditingRow(row.id);
    const d: Record<string, string> = {};
    currentTable?.columns.forEach(c => { d[c.name] = String(row.data[c.name] ?? ""); });
    setEditData(d);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Data Explorer</h1>
        <p className="text-muted-foreground text-sm">Browse and edit data in your tables · mainwebdb.json</p>
      </div>

      <div className="flex gap-3 flex-wrap">
        <Select value={selectedDb} onValueChange={(v) => { setSelectedDb(v); setSelectedTable(""); }}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select database" /></SelectTrigger>
          <SelectContent>{databases.map((d) => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}</SelectContent>
        </Select>
        <Select value={selectedTable} onValueChange={setSelectedTable} disabled={!selectedDb}>
          <SelectTrigger className="w-[200px]"><SelectValue placeholder="Select table" /></SelectTrigger>
          <SelectContent>{tables.map((t) => <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>)}</SelectContent>
        </Select>
        {currentTable && (
          <Dialog open={addOpen} onOpenChange={setAddOpen}>
            <DialogTrigger asChild><Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> Add Row</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Row</DialogTitle>
                <DialogDescription>Enter values for each column.</DialogDescription>
              </DialogHeader>
              <div className="space-y-3">
                {currentTable.columns.map((c) => (
                  <div key={c.id} className="space-y-1">
                    <label className="text-sm font-medium">{c.name} <span className="text-muted-foreground">({c.data_type})</span></label>
                    <Input value={newRow[c.name] || ""} onChange={(e) => setNewRow({ ...newRow, [c.name]: e.target.value })} />
                  </div>
                ))}
              </div>
              <DialogFooter><Button onClick={handleAddRow} className="gradient-primary text-primary-foreground">Add</Button></DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {!currentTable ? (
        <Card className="glass-card"><CardContent className="flex flex-col items-center py-12">
          <Table2 className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">Select a database and table to explore data</p>
        </CardContent></Card>
      ) : (
        <Card className="glass-card">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {currentTable.columns.map((c) => <TableHead key={c.id}>{c.name}</TableHead>)}
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentTable.rows.length === 0 ? (
                  <TableRow><TableCell colSpan={currentTable.columns.length + 1} className="text-center text-muted-foreground py-8">No data</TableCell></TableRow>
                ) : currentTable.rows.map((row) => (
                  <TableRow key={row.id}>
                    {currentTable.columns.map((c) => (
                      <TableCell key={c.id}>
                        {editingRow === row.id ? (
                          <Input className="h-8 text-sm" value={editData[c.name] || ""} onChange={(e) => setEditData({ ...editData, [c.name]: e.target.value })} />
                        ) : (
                          <span className="text-sm">{String(row.data[c.name] ?? "")}</span>
                        )}
                      </TableCell>
                    ))}
                    <TableCell className="text-right">
                      {editingRow === row.id ? (
                        <Button size="sm" variant="ghost" onClick={() => handleSaveEdit(row.id)}><Save className="w-4 h-4 text-green-600" /></Button>
                      ) : (
                        <Button size="sm" variant="ghost" onClick={() => startEdit(row)}>Edit</Button>
                      )}
                      <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDeleteRow(row.id)}><Trash2 className="w-4 h-4" /></Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataExplorer;
