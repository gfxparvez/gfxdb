import { Link } from "react-router-dom";
import { Database, ArrowRight, BookOpen, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const CodeBlock = ({ code, lang }: { code: string; lang: string }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <button onClick={copy} className="absolute top-3 right-3 p-1.5 rounded-md bg-muted/80 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>
      <pre className="bg-muted/50 border border-border rounded-xl p-5 text-sm leading-relaxed overflow-x-auto">
        <code>{code}</code>
      </pre>
    </div>
  );
};

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: () => (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          GFX DB stores all data in <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">mainwebdb.json</code> via localStorage. 
          No external database needed — everything runs in the browser.
        </p>
        <div className="glass-card rounded-xl p-5 mt-6">
          <p className="text-sm font-medium mb-2">Storage</p>
          <code className="text-sm font-mono text-primary">localStorage → mainwebdb.json</code>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm font-medium mb-3">Data Structure</p>
          <CodeBlock lang="json" code={`{
  "users": [...],
  "databases": [...],
  "api_keys": [...],
  "query_logs": [...],
  "copyright_strikes": [...]
}`} />
        </div>
      </div>
    ),
  },
  {
    id: "getting-started",
    title: "Getting Started",
    content: () => (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          1. Sign up for an account<br/>
          2. Create a database<br/>
          3. Add tables with columns<br/>
          4. Start adding data via the Data Explorer<br/>
          5. Use the API key for external access
        </p>
        <CodeBlock lang="json" code={`// All data is stored in localStorage
// Export anytime as mainwebdb.json from Settings
// Import to restore from a backup file`} />
      </div>
    ),
  },
  {
    id: "copyright",
    title: "Copyright & Protection",
    content: () => (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          All content created on GFX DB is automatically protected under copyright.
        </p>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm font-bold text-primary mb-2">© GFX DEVELOPER PARVEZ</p>
          <p className="text-sm text-muted-foreground">
            GFX DB and all associated content, code, and designs are the intellectual property of GFX DEVELOPER PARVEZ.
            Unauthorized reproduction, distribution, or modification is strictly prohibited and may result in legal action.
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Auto Copyright Strike System protects all user-created databases and content.
          </p>
        </div>
      </div>
    ),
  },
];

const Docs = () => {
  const [active, setActive] = useState("overview");
  const activeSection = sections.find(s => s.id === active);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/landing" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-[Space_Grotesk]">GFX DB</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/auth">
              <Button size="sm" className="gradient-primary border-0 text-white gap-1.5">
                Dashboard <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-12">
          <h1 className="text-4xl font-bold font-[Space_Grotesk] mb-3">Documentation</h1>
          <p className="text-lg text-muted-foreground">Everything you need to use GFX DB</p>
        </div>

        <div className="grid md:grid-cols-[240px_1fr] gap-8">
          <aside className="space-y-1">
            {sections.map(s => (
              <button key={s.id} onClick={() => setActive(s.id)}
                className={`w-full text-left px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active === s.id ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}>
                {s.title}
              </button>
            ))}
          </aside>
          <div>
            <h2 className="text-2xl font-bold font-[Space_Grotesk] mb-6">{activeSection?.title}</h2>
            {activeSection?.content()}
          </div>
        </div>
      </div>

      <footer className="border-t border-border bg-muted/20 mt-12">
        <div className="max-w-6xl mx-auto px-6 py-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} GFX DB. All rights reserved. Developed by <span className="font-semibold text-primary">GFX DEVELOPER PARVEZ</span>
        </div>
      </footer>
    </div>
  );
};

export default Docs;
