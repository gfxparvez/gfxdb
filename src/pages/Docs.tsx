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

const BASE_URL = "https://leaplzpewcvgsqvyorve.supabase.co/functions/v1/db-api";

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: () => (
      <div className="space-y-4">
        <p className="text-muted-foreground leading-relaxed">
          CloudDB provides a simple REST API for CRUD operations on your databases. All requests are made via <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">POST</code> to a single endpoint, authenticated with your API key.
        </p>
        <p className="text-muted-foreground leading-relaxed">
          Data is stored as <strong>JSON objects</strong> — no rigid schemas required. Each row is a flexible JSON document that you can structure however you like.
        </p>
        <div className="glass-card rounded-xl p-5 mt-6">
          <p className="text-sm font-medium mb-2">Base URL</p>
          <code className="text-sm font-mono text-primary break-all">{BASE_URL}</code>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-sm font-medium mb-3">Request Format</p>
          <CodeBlock lang="json" code={`{
  "api_key": "your-api-key",
  "action": "select | insert | update | delete",
  "table": "table_name",
  "data": { ... },        // for insert/update
  "filters": { ... },     // for select
  "row_id": "uuid"        // for update/delete
}`} />
        </div>
      </div>
    ),
  },
  {
    id: "insert",
    title: "Insert Data",
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground">Add a new row to any table. The <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">data</code> field accepts any JSON object.</p>
        <Tabs defaultValue="react">
          <TabsList><TabsTrigger value="react">React</TabsTrigger><TabsTrigger value="node">Node.js</TabsTrigger><TabsTrigger value="python">Python</TabsTrigger><TabsTrigger value="curl">cURL</TabsTrigger></TabsList>
          <TabsContent value="react"><CodeBlock lang="jsx" code={`import { useState } from "react";

function CreateUser() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("${BASE_URL}", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        api_key: "your-api-key",
        action: "insert",
        table: "users",
        data: { name, email }
      })
    });
    const result = await res.json();
    console.log("Created:", result.data);
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" />
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
      <button type="submit">Create User</button>
    </form>
  );
}`} /></TabsContent>
          <TabsContent value="node"><CodeBlock lang="js" code={`const fetch = require("node-fetch");

async function insertUser(name, email) {
  const response = await fetch("${BASE_URL}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.CLOUDDB_API_KEY,
      action: "insert",
      table: "users",
      data: { name, email }
    })
  });

  const result = await response.json();
  console.log("Inserted:", result.data);
  return result.data;
}

// Usage
insertUser("Alice", "alice@example.com");`} /></TabsContent>
          <TabsContent value="python"><CodeBlock lang="python" code={`import requests
import os

API_KEY = os.environ.get("CLOUDDB_API_KEY")
BASE_URL = "${BASE_URL}"

def insert_user(name: str, email: str) -> dict:
    response = requests.post(BASE_URL, json={
        "api_key": API_KEY,
        "action": "insert",
        "table": "users",
        "data": {"name": name, "email": email}
    })
    result = response.json()
    print("Inserted:", result["data"])
    return result["data"]

# Usage
insert_user("Alice", "alice@example.com")`} /></TabsContent>
          <TabsContent value="curl"><CodeBlock lang="bash" code={`curl -X POST ${BASE_URL} \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your-api-key",
    "action": "insert",
    "table": "users",
    "data": {
      "name": "Alice",
      "email": "alice@example.com"
    }
  }'`} /></TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    id: "select",
    title: "Query Data",
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground">Retrieve rows from a table. Optionally filter by field values.</p>
        <Tabs defaultValue="react">
          <TabsList><TabsTrigger value="react">React</TabsTrigger><TabsTrigger value="node">Node.js</TabsTrigger><TabsTrigger value="python">Python</TabsTrigger><TabsTrigger value="curl">cURL</TabsTrigger></TabsList>
          <TabsContent value="react"><CodeBlock lang="jsx" code={`import { useEffect, useState } from "react";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch("${BASE_URL}", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          api_key: "your-api-key",
          action: "select",
          table: "users",
          filters: {}  // add filters like { name: "Alice" }
        })
      });
      const result = await res.json();
      setUsers(result.data || []);
    }
    fetchUsers();
  }, []);

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.name} — {user.email}</li>
      ))}
    </ul>
  );
}`} /></TabsContent>
          <TabsContent value="node"><CodeBlock lang="js" code={`async function getUsers(filters = {}) {
  const response = await fetch("${BASE_URL}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.CLOUDDB_API_KEY,
      action: "select",
      table: "users",
      filters
    })
  });
  const result = await response.json();
  return result.data;
}

// Get all users
const allUsers = await getUsers();

// Filter by name
const alice = await getUsers({ name: "Alice" });`} /></TabsContent>
          <TabsContent value="python"><CodeBlock lang="python" code={`def get_users(filters: dict = None) -> list:
    response = requests.post(BASE_URL, json={
        "api_key": API_KEY,
        "action": "select",
        "table": "users",
        "filters": filters or {}
    })
    result = response.json()
    return result["data"]

# Get all users
all_users = get_users()

# Filter by name
alice = get_users({"name": "Alice"})
print(alice)`} /></TabsContent>
          <TabsContent value="curl"><CodeBlock lang="bash" code={`# Get all rows
curl -X POST ${BASE_URL} \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your-api-key",
    "action": "select",
    "table": "users",
    "filters": {}
  }'

# Filter by name
curl -X POST ${BASE_URL} \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your-api-key",
    "action": "select",
    "table": "users",
    "filters": { "name": "Alice" }
  }'`} /></TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    id: "update",
    title: "Update Data",
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground">Update an existing row by its ID. Only the fields you pass in <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">data</code> will be changed — others are preserved.</p>
        <Tabs defaultValue="react">
          <TabsList><TabsTrigger value="react">React</TabsTrigger><TabsTrigger value="node">Node.js</TabsTrigger><TabsTrigger value="python">Python</TabsTrigger><TabsTrigger value="curl">cURL</TabsTrigger></TabsList>
          <TabsContent value="react"><CodeBlock lang="jsx" code={`async function updateUser(rowId, updates) {
  const res = await fetch("${BASE_URL}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: "your-api-key",
      action: "update",
      table: "users",
      row_id: rowId,
      data: updates
    })
  });
  const result = await res.json();
  return result.data;
}

// Update email only — name stays the same
await updateUser("row-uuid-here", { email: "newemail@example.com" });`} /></TabsContent>
          <TabsContent value="node"><CodeBlock lang="js" code={`async function updateUser(rowId, updates) {
  const response = await fetch("${BASE_URL}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.CLOUDDB_API_KEY,
      action: "update",
      table: "users",
      row_id: rowId,
      data: updates
    })
  });
  return (await response.json()).data;
}

await updateUser("row-uuid", { email: "new@email.com" });`} /></TabsContent>
          <TabsContent value="python"><CodeBlock lang="python" code={`def update_user(row_id: str, updates: dict) -> dict:
    response = requests.post(BASE_URL, json={
        "api_key": API_KEY,
        "action": "update",
        "table": "users",
        "row_id": row_id,
        "data": updates
    })
    return response.json()["data"]

# Update email
update_user("row-uuid", {"email": "new@email.com"})`} /></TabsContent>
          <TabsContent value="curl"><CodeBlock lang="bash" code={`curl -X POST ${BASE_URL} \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your-api-key",
    "action": "update",
    "table": "users",
    "row_id": "row-uuid-here",
    "data": { "email": "new@email.com" }
  }'`} /></TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    id: "delete",
    title: "Delete Data",
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground">Remove a row by its ID. This action is permanent.</p>
        <Tabs defaultValue="react">
          <TabsList><TabsTrigger value="react">React</TabsTrigger><TabsTrigger value="node">Node.js</TabsTrigger><TabsTrigger value="python">Python</TabsTrigger><TabsTrigger value="curl">cURL</TabsTrigger></TabsList>
          <TabsContent value="react"><CodeBlock lang="jsx" code={`async function deleteUser(rowId) {
  const res = await fetch("${BASE_URL}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: "your-api-key",
      action: "delete",
      table: "users",
      row_id: rowId
    })
  });
  const result = await res.json();
  console.log("Deleted:", result);
}

await deleteUser("row-uuid-here");`} /></TabsContent>
          <TabsContent value="node"><CodeBlock lang="js" code={`async function deleteUser(rowId) {
  const response = await fetch("${BASE_URL}", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: process.env.CLOUDDB_API_KEY,
      action: "delete",
      table: "users",
      row_id: rowId
    })
  });
  return (await response.json());
}

await deleteUser("row-uuid");`} /></TabsContent>
          <TabsContent value="python"><CodeBlock lang="python" code={`def delete_user(row_id: str) -> dict:
    response = requests.post(BASE_URL, json={
        "api_key": API_KEY,
        "action": "delete",
        "table": "users",
        "row_id": row_id
    })
    return response.json()

# Delete a user
delete_user("row-uuid")`} /></TabsContent>
          <TabsContent value="curl"><CodeBlock lang="bash" code={`curl -X POST ${BASE_URL} \\
  -H "Content-Type: application/json" \\
  -d '{
    "api_key": "your-api-key",
    "action": "delete",
    "table": "users",
    "row_id": "row-uuid-here"
  }'`} /></TabsContent>
        </Tabs>
      </div>
    ),
  },
  {
    id: "fullapp-react",
    title: "Full React App",
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground">A complete React app with CloudDB — list, create, update, and delete users.</p>
        <CodeBlock lang="jsx" code={`import { useState, useEffect, useCallback } from "react";

const API_URL = "${BASE_URL}";
const API_KEY = "your-api-key";

function api(body) {
  return fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: API_KEY, ...body })
  }).then(r => r.json());
}

export default function App() {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const load = useCallback(async () => {
    const { data } = await api({ action: "select", table: "users" });
    setUsers(data || []);
  }, []);

  useEffect(() => { load(); }, [load]);

  const create = async (e) => {
    e.preventDefault();
    await api({ action: "insert", table: "users", data: { name, email } });
    setName(""); setEmail("");
    load();
  };

  const remove = async (id) => {
    await api({ action: "delete", table: "users", row_id: id });
    load();
  };

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>CloudDB Users</h1>
      <form onSubmit={create} style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        <input value={name} onChange={e => setName(e.target.value)} placeholder="Name" required />
        <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {users.map(u => (
          <li key={u.id} style={{ marginBottom: 8 }}>
            <strong>{u.name}</strong> — {u.email}
            <button onClick={() => remove(u.id)} style={{ marginLeft: 12 }}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}`} />
      </div>
    ),
  },
  {
    id: "fullapp-node",
    title: "Full Node.js App",
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground">An Express.js server that proxies CloudDB for your frontend.</p>
        <CodeBlock lang="js" code={`const express = require("express");
const fetch = require("node-fetch");

const app = express();
app.use(express.json());

const API_URL = "${BASE_URL}";
const API_KEY = process.env.CLOUDDB_API_KEY;

async function clouddb(body) {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: API_KEY, ...body })
  });
  return res.json();
}

// List users
app.get("/users", async (req, res) => {
  const result = await clouddb({ action: "select", table: "users" });
  res.json(result.data);
});

// Create user
app.post("/users", async (req, res) => {
  const { name, email } = req.body;
  const result = await clouddb({
    action: "insert", table: "users", data: { name, email }
  });
  res.status(201).json(result.data);
});

// Update user
app.put("/users/:id", async (req, res) => {
  const result = await clouddb({
    action: "update", table: "users",
    row_id: req.params.id, data: req.body
  });
  res.json(result.data);
});

// Delete user
app.delete("/users/:id", async (req, res) => {
  const result = await clouddb({
    action: "delete", table: "users", row_id: req.params.id
  });
  res.json(result);
});

app.listen(3000, () => console.log("Server running on :3000"));`} />
      </div>
    ),
  },
  {
    id: "fullapp-python",
    title: "Full Python App",
    content: () => (
      <div className="space-y-6">
        <p className="text-muted-foreground">A Flask API server using CloudDB as the data layer.</p>
        <CodeBlock lang="python" code={`from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

API_URL = "${BASE_URL}"
API_KEY = os.environ["CLOUDDB_API_KEY"]

def clouddb(body):
    body["api_key"] = API_KEY
    r = requests.post(API_URL, json=body)
    return r.json()

@app.route("/users", methods=["GET"])
def list_users():
    result = clouddb({"action": "select", "table": "users"})
    return jsonify(result["data"])

@app.route("/users", methods=["POST"])
def create_user():
    data = request.get_json()
    result = clouddb({
        "action": "insert",
        "table": "users",
        "data": {"name": data["name"], "email": data["email"]}
    })
    return jsonify(result["data"]), 201

@app.route("/users/<row_id>", methods=["PUT"])
def update_user(row_id):
    data = request.get_json()
    result = clouddb({
        "action": "update",
        "table": "users",
        "row_id": row_id,
        "data": data
    })
    return jsonify(result["data"])

@app.route("/users/<row_id>", methods=["DELETE"])
def delete_user(row_id):
    result = clouddb({
        "action": "delete",
        "table": "users",
        "row_id": row_id
    })
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)`} />
      </div>
    ),
  },
  {
    id: "errors",
    title: "Error Handling",
    content: () => (
      <div className="space-y-4">
        <p className="text-muted-foreground">All errors return a JSON object with an <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">error</code> field.</p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b border-border"><th className="text-left py-3 px-4 font-medium">Status</th><th className="text-left py-3 px-4 font-medium">Meaning</th><th className="text-left py-3 px-4 font-medium">Example</th></tr></thead>
            <tbody className="text-muted-foreground">
              <tr className="border-b border-border"><td className="py-3 px-4 font-mono">400</td><td className="py-3 px-4">Bad request — missing fields</td><td className="py-3 px-4 font-mono text-xs">{`{"error":"Missing required fields"}`}</td></tr>
              <tr className="border-b border-border"><td className="py-3 px-4 font-mono">401</td><td className="py-3 px-4">Invalid or inactive API key</td><td className="py-3 px-4 font-mono text-xs">{`{"error":"Invalid or inactive API key"}`}</td></tr>
              <tr className="border-b border-border"><td className="py-3 px-4 font-mono">404</td><td className="py-3 px-4">Table or row not found</td><td className="py-3 px-4 font-mono text-xs">{`{"error":"Table \"x\" not found"}`}</td></tr>
              <tr><td className="py-3 px-4 font-mono">500</td><td className="py-3 px-4">Internal server error</td><td className="py-3 px-4 font-mono text-xs">{`{"error":"Internal server error"}`}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    ),
  },
];

const Docs = () => {
  const [active, setActive] = useState("overview");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl gradient-primary flex items-center justify-center">
              <Database className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight font-[Space_Grotesk]">CloudDB</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link to="/docs">
              <Button variant="ghost" size="sm" className="gap-1.5"><BookOpen className="w-4 h-4" /> Docs</Button>
            </Link>
            <Link to="/auth">
              <Button size="sm" className="gradient-primary border-0 text-white gap-1.5">
                Get Started <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-10 flex gap-10">
        {/* Sidebar */}
        <aside className="hidden lg:block w-56 shrink-0">
          <div className="sticky top-24 space-y-1">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">API Reference</p>
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                  active === s.id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {s.title}
              </button>
            ))}
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0">
          {/* Mobile nav */}
          <div className="lg:hidden mb-6 overflow-x-auto">
            <div className="flex gap-2 pb-2">
              {sections.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-sm transition-colors ${
                    active === s.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.title}
                </button>
              ))}
            </div>
          </div>

          {sections.map((s) =>
            active === s.id ? (
              <div key={s.id}>
                <h1 className="text-3xl font-bold font-[Space_Grotesk] mb-6">{s.title}</h1>
                {s.content()}
              </div>
            ) : null
          )}
        </main>
      </div>
    </div>
  );
};

export default Docs;
