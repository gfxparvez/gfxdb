import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { loadDB } from "@/lib/mainwebdb";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Database, Key, Activity, Plus, ArrowRight, Shield } from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({ databases: 0, apiKeys: 0, requests: 0, strikes: 0 });

  useEffect(() => {
    if (!user) return;
    const db = loadDB();
    const myDbs = db.databases.filter(d => d.user_id === user.id);
    const myKeys = db.api_keys.filter(k => k.user_id === user.id);
    const myLogs = db.query_logs.filter(l => l.user_id === user.id);
    const myStrikes = db.copyright_strikes.filter(s => s.user_id === user.id);
    setStats({ databases: myDbs.length, apiKeys: myKeys.length, requests: myLogs.length, strikes: myStrikes.length });
  }, [user]);

  const statCards = [
    { label: "Databases", value: stats.databases, icon: Database, color: "from-purple-500 to-indigo-600" },
    { label: "API Keys", value: stats.apiKeys, icon: Key, color: "from-pink-500 to-rose-600" },
    { label: "Total Requests", value: stats.requests, icon: Activity, color: "from-orange-400 to-amber-600" },
    { label: "Copyright Strikes", value: stats.strikes, icon: Shield, color: "from-emerald-500 to-green-600" },
  ];

  return (
    <div className="space-y-8">
      {/* Hero banner */}
      <div className="rounded-2xl gradient-primary p-6 md:p-8 text-white">
        <h1 className="text-2xl md:text-3xl font-bold">Welcome back, {user?.display_name || "Developer"}! 👋</h1>
        <p className="mt-2 text-white/80 max-w-xl">Manage your databases, API keys, and data — all saved in mainwebdb.json</p>
        <div className="mt-4 flex gap-3 flex-wrap">
          <Button asChild variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
            <Link to="/databases"><Plus className="w-4 h-4" /> Create Database</Link>
          </Button>
          <Button asChild variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-0">
            <Link to="/api-keys">View API Keys <ArrowRight className="w-4 h-4" /></Link>
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((s) => (
          <Card key={s.label} className="glass-card overflow-hidden">
            <CardContent className="p-5 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shrink-0`}>
                <s.icon className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { title: "Create Database", desc: "Spin up a new database in seconds", to: "/databases", icon: Database },
          { title: "View API Keys", desc: "Manage keys and connection snippets", to: "/api-keys", icon: Key },
          { title: "Query Logs", desc: "Monitor your API usage and performance", to: "/logs", icon: Activity },
        ].map((a) => (
          <Link key={a.to} to={a.to}>
            <Card className="glass-card hover:shadow-lg transition-shadow cursor-pointer group h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <a.icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">{a.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{a.desc}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Copyright notice */}
      <div className="glass-card rounded-xl p-4 flex items-center gap-3">
        <Shield className="w-5 h-5 text-primary shrink-0" />
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} GFX DB — Auto Copyright Protection Active. All databases and content are protected by <span className="text-primary font-semibold">GFX DEVELOPER PARVEZ</span>.
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
