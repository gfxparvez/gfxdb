import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { loadDB, saveDB, exportDB, importDB, CopyrightStrike } from "@/lib/mainwebdb";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Save, Download, Upload, Shield, Trash2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

const SettingsPage = () => {
  const { user, signOut, updateProfile, updatePassword } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState(user?.display_name || "");
  const [newPassword, setNewPassword] = useState("");
  const [strikes, setStrikes] = useState<CopyrightStrike[]>(() => {
    const db = loadDB();
    return db.copyright_strikes.filter(s => s.user_id === user?.id);
  });

  const handleUpdateProfile = () => {
    updateProfile(displayName);
    toast({ title: "Profile updated" });
  };

  const handleChangePassword = async () => {
    if (newPassword.length < 6) { toast({ title: "Password too short", variant: "destructive" }); return; }
    const { error } = await updatePassword(newPassword);
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else { toast({ title: "Password updated" }); setNewPassword(""); }
  };

  const handleExport = () => {
    exportDB();
    toast({ title: "Database exported as mainwebdb.json" });
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;
      try {
        await importDB(file);
        toast({ title: "Database imported successfully! Refresh to see changes." });
      } catch (err: any) {
        toast({ title: "Import failed", description: err.message, variant: "destructive" });
      }
    };
    input.click();
  };

  const dismissStrike = (strikeId: string) => {
    const db = loadDB();
    const idx = db.copyright_strikes.findIndex(s => s.id === strikeId);
    if (idx >= 0) {
      db.copyright_strikes[idx].status = "dismissed";
      saveDB(db);
      setStrikes(db.copyright_strikes.filter(s => s.user_id === user?.id));
      toast({ title: "Strike dismissed" });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground text-sm">Manage your profile, data, and copyright</p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Profile</CardTitle>
          <CardDescription>Update your display name</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email || ""} disabled />
          </div>
          <div className="space-y-2">
            <Label>Display Name</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <Button onClick={handleUpdateProfile} className="gradient-primary text-primary-foreground">
            <Save className="w-4 h-4" /> Save
          </Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg">Change Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>New Password</Label>
            <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="Minimum 6 characters" />
          </div>
          <Button onClick={handleChangePassword} variant="outline">Update Password</Button>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Download className="w-5 h-5" /> Data Management</CardTitle>
          <CardDescription>Export or import your mainwebdb.json file</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download className="w-4 h-4" /> Export mainwebdb.json
          </Button>
          <Button onClick={handleImport} variant="outline" className="gap-2">
            <Upload className="w-4 h-4" /> Import mainwebdb.json
          </Button>
        </CardContent>
      </Card>

      {/* Copyright Strikes */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2"><Shield className="w-5 h-5 text-primary" /> Copyright Protection</CardTitle>
          <CardDescription>Auto copyright strike system by GFX DEVELOPER PARVEZ</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="glass-card rounded-lg p-4 mb-4 text-sm text-muted-foreground">
            <p>🛡️ All content created on GFX DB is automatically protected under international copyright law.</p>
            <p className="mt-1">© {new Date().getFullYear()} GFX DB — Developed by <span className="text-primary font-semibold">GFX DEVELOPER PARVEZ</span></p>
            <p className="mt-1">Unauthorized use, reproduction, or distribution is strictly prohibited.</p>
          </div>

          {strikes.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Content</TableHead>
                  <TableHead>Reason</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {strikes.map(s => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium text-sm">{s.content_name}</TableCell>
                    <TableCell className="text-sm text-muted-foreground">{s.strike_reason}</TableCell>
                    <TableCell>
                      <Badge variant={s.status === "active" ? "destructive" : "outline"}>
                        {s.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{new Date(s.created_at).toLocaleDateString()}</TableCell>
                    <TableCell>
                      {s.status === "active" && (
                        <Button size="sm" variant="ghost" onClick={() => dismissStrike(s.id)}>Dismiss</Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-4">No copyright strikes. All content is protected. ✅</p>
          )}
        </CardContent>
      </Card>

      <Card className="glass-card border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg text-destructive">Danger Zone</CardTitle>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button variant="destructive" onClick={signOut}>Sign Out</Button>
          <Button variant="outline" className="text-destructive border-destructive/30" onClick={() => {
            if (confirm("⚠️ This will delete ALL data from mainwebdb.json. Are you sure?")) {
              localStorage.removeItem("mainwebdb");
              localStorage.removeItem("gfxdb_session");
              window.location.reload();
            }
          }}>
            <Trash2 className="w-4 h-4" /> Clear All Data
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default SettingsPage;
