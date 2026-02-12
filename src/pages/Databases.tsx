import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loadDB, saveDB, generateId, generateApiKey, autoCopyrightCheck, DatabaseRecord } from "@/lib/mainwebdb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, Trash2, Database, Eye } from "lucide-react";
import { Link } from "react-router-dom";

const Databases = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [databases, setDatabases] = useState<DatabaseRecord[]>([]);
  const [createOpen, setCreateOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const refresh = () => {
    if (!user) return;
    const db = loadDB();
    setDatabases(db.databases.filter(d => d.user_id === user.id));
  };

  useEffect(() => { refresh(); }, [user]);

  const handleCreate = () => {
    if (!user || !name.trim()) return;
    const db = loadDB();

    // Auto copyright check
    const strike = autoCopyrightCheck(db, user.id, name.trim(), "", "database");
    if (strike) {
      toast({ title: "⚠️ Copyright Strike", description: strike.strike_reason, variant: "destructive" });
    }

    const dbId = generateId();
    const newDb: DatabaseRecord = {
      id: dbId, user_id: user.id, name: name.trim(), description,
      status: "active", tables: [], created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    };
    db.databases.push(newDb);
    db.api_keys.push({
      id: generateId(), user_id: user.id, database_id: dbId,
      key_value: generateApiKey(), name: `Key for ${name.trim()}`,
      is_active: true, last_used_at: null, created_at: new Date().toISOString(),
    });
    saveDB(db);
    toast({ title: "Database created!", description: `"${name.trim()}" is ready.` });
    setName(""); setDescription(""); setCreateOpen(false);
    refresh();
  };

  const handleDelete = (id: string) => {
    const db = loadDB();
    db.databases = db.databases.filter(d => d.id !== id);
    db.api_keys = db.api_keys.filter(k => k.database_id !== id);
    db.query_logs = db.query_logs.filter(l => l.database_id !== id);
    saveDB(db);
    toast({ title: "Deleted" });
    refresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Databases</h1>
          <p className="text-muted-foreground text-sm">Create and manage your databases · Saved in mainwebdb.json</p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> New Database</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Database</DialogTitle>
              <DialogDescription>Give your database a name and optional description.</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2"><Label>Name</Label><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="my-app-db" /></div>
              <div className="space-y-2"><Label>Description</Label><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Optional description..." /></div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={!name.trim()} className="gradient-primary text-primary-foreground">Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {databases.length === 0 ? (
        <Card className="glass-card">
          <CardContent className="flex flex-col items-center py-12">
            <Database className="w-12 h-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground mb-4">No databases yet</p>
            <Button onClick={() => setCreateOpen(true)} className="gradient-primary text-primary-foreground"><Plus className="w-4 h-4" /> Create your first database</Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="glass-card">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Tables</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {databases.map((db) => (
                <TableRow key={db.id}>
                  <TableCell className="font-medium">{db.name}</TableCell>
                  <TableCell>{db.tables.length}</TableCell>
                  <TableCell><Badge variant="outline" className="text-green-600 border-green-300 bg-green-50">{db.status}</Badge></TableCell>
                  <TableCell className="text-muted-foreground text-sm">{new Date(db.created_at).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button asChild size="sm" variant="ghost"><Link to={`/databases/${db.id}`}><Eye className="w-4 h-4" /></Link></Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive"><Trash2 className="w-4 h-4" /></Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{db.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>This will permanently delete the database, all its tables, data, and API keys.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDelete(db.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
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

export default Databases;
