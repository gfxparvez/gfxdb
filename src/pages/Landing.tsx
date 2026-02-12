import { Link } from "react-router-dom";
import { Database, Key, BarChart3, Code2, Zap, Shield, BookOpen, ArrowRight, Terminal, Layers, FileJson, Copyright } from "lucide-react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Database,
    title: "Instant Databases",
    desc: "Spin up a new database in seconds. Define tables and columns with a visual editor — no SQL required.",
  },
  {
    icon: FileJson,
    title: "JSON File Storage",
    desc: "All data persists in mainwebdb.json via localStorage. Export, import, and manage your data file anytime.",
  },
  {
    icon: Key,
    title: "API Key Auth",
    desc: "Each database gets a unique API key. Manage, rotate, and revoke keys from your dashboard.",
  },
  {
    icon: Code2,
    title: "REST API Ready",
    desc: "Full CRUD via a simple JSON REST API. Works with any language — React, Node.js, Python, and more.",
  },
  {
    icon: Shield,
    title: "Auto Copyright Protection",
    desc: "Built-in copyright strike system automatically protects your content with DMCA-ready notices.",
  },
  {
    icon: BarChart3,
    title: "Usage Analytics",
    desc: "Track every request with real-time query logs, charts, and performance metrics.",
  },
];

const codeSnippet = `// GFX DB — Insert data with a single fetch call
const res = await fetch("https://gfxdb.lovable.app/api", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    api_key: "gfx_your-api-key",
    action: "insert",
    table: "users",
    data: { name: "Parvez", email: "parvez@gfxdev.com" }
  })
});
const { data } = await res.json();`;

const Landing = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-[Space_Grotesk]">GFX DB</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/docs">
              <Button variant="ghost" size="sm" className="gap-1.5">
                <BookOpen className="w-4 h-4" /> Docs
              </Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary border-0 text-white gap-1.5">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 50% at 50% -20%, hsl(258 80% 58% / .4), transparent)"
        }} />
        <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
            <Zap className="w-3.5 h-3.5" /> JSON-Powered Database Platform
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight tracking-tight font-[Space_Grotesk] mb-6">
            GFX <span className="gradient-text">DB</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-4 leading-relaxed">
            Create databases, define schemas, and manage all your data — stored in a single <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono text-primary">mainwebdb.json</code> file.
          </p>
          <p className="text-sm text-muted-foreground mb-10">
            By <span className="font-semibold text-primary">GFX DEVELOPER PARVEZ</span>
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/auth">
              <Button size="lg" className="gradient-primary border-0 text-white text-base px-8 h-12 gap-2">
                Start Building Free <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/docs">
              <Button variant="outline" size="lg" className="text-base px-8 h-12 gap-2">
                <BookOpen className="w-5 h-5" /> Read the Docs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Code preview */}
      <section className="max-w-4xl mx-auto px-6 pb-20">
        <div className="glass-card rounded-2xl overflow-hidden shadow-2xl shadow-primary/5">
          <div className="flex items-center gap-2 px-4 py-3 bg-muted/50 border-b border-border">
            <div className="flex gap-1.5">
              <span className="w-3 h-3 rounded-full bg-destructive/60" />
              <span className="w-3 h-3 rounded-full bg-warning/60" />
              <span className="w-3 h-3 rounded-full bg-success/60" />
            </div>
            <span className="text-xs text-muted-foreground ml-2 font-mono flex items-center gap-1.5">
              <Terminal className="w-3 h-3" /> app.js
            </span>
          </div>
          <pre className="p-6 text-sm leading-relaxed overflow-x-auto text-foreground">
            <code>{codeSnippet}</code>
          </pre>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-6 pb-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold font-[Space_Grotesk] mb-4">
            Everything you need to ship&nbsp;faster
          </h2>
          <p className="text-muted-foreground text-lg max-w-xl mx-auto">
            From schema design to copyright protection — GFX DB handles everything so you can focus on building.
          </p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f) => (
            <div key={f.title} className="glass-card rounded-2xl p-6 hover:shadow-lg hover:shadow-primary/5 transition-all group">
              <div className="w-11 h-11 rounded-xl gradient-primary flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <f.icon className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold font-[Space_Grotesk] mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="border-t border-border bg-muted/30">
        <div className="max-w-4xl mx-auto px-6 py-24">
          <h2 className="text-3xl md:text-4xl font-bold font-[Space_Grotesk] text-center mb-16">
            Three steps to your&nbsp;database
          </h2>
          <div className="grid md:grid-cols-3 gap-10">
            {[
              { step: "1", icon: Layers, title: "Create a Database", desc: "Name it, describe it, and your database is live in localStorage." },
              { step: "2", icon: Terminal, title: "Define Your Schema", desc: "Add tables and columns with our visual editor." },
              { step: "3", icon: Code2, title: "Start Querying", desc: "Grab your API key and make your first request." },
            ].map((s) => (
              <div key={s.step} className="text-center">
                <div className="w-14 h-14 rounded-2xl gradient-primary flex items-center justify-center mx-auto mb-5 text-white text-xl font-bold font-[Space_Grotesk]">
                  {s.step}
                </div>
                <h3 className="text-lg font-semibold font-[Space_Grotesk] mb-2">{s.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Copyright notice */}
      <section className="max-w-4xl mx-auto px-6 py-16">
        <div className="glass-card rounded-2xl p-8 text-center">
          <Copyright className="w-10 h-10 text-primary mx-auto mb-4" />
          <h3 className="text-xl font-bold font-[Space_Grotesk] mb-3">Auto Copyright Protection</h3>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto mb-4">
            All content created on GFX DB is automatically protected under copyright law. 
            Unauthorized reproduction, distribution, or modification of any content is strictly prohibited.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Shield className="w-4 h-4" /> DMCA Protected · Auto Strike System Active
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-6 py-24 text-center">
        <h2 className="text-3xl md:text-5xl font-bold font-[Space_Grotesk] mb-6">
          Ready to build?
        </h2>
        <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto">
          Create your first database in under a minute. No server needed — everything runs locally.
        </p>
        <Link to="/auth">
          <Button size="lg" className="gradient-primary border-0 text-white text-base px-10 h-12 gap-2">
            Get Started Free <ArrowRight className="w-5 h-5" />
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted/20">
        <div className="max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg gradient-primary flex items-center justify-center">
              <Database className="w-3 h-3 text-white" />
            </div>
            <span className="font-semibold text-foreground font-[Space_Grotesk]">GFX DB</span>
          </div>
          <div className="flex gap-6">
            <Link to="/docs" className="hover:text-foreground transition-colors">Documentation</Link>
            <Link to="/auth" className="hover:text-foreground transition-colors">Sign In</Link>
          </div>
          <div className="text-center">
            <span>© {new Date().getFullYear()} GFX DB. All rights reserved.</span>
            <br />
            <span className="text-xs">Developed by <span className="font-semibold text-primary">GFX DEVELOPER PARVEZ</span></span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
