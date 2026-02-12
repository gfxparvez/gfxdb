// mainwebdb.json — localStorage-based JSON database manager
// All data is stored in localStorage under the key "mainwebdb"

export interface User {
  id: string;
  email: string;
  password: string;
  display_name: string;
  created_at: string;
}

export interface DatabaseRecord {
  id: string;
  user_id: string;
  name: string;
  description: string;
  status: string;
  tables: TableRecord[];
  created_at: string;
  updated_at: string;
}

export interface TableRecord {
  id: string;
  name: string;
  columns: ColumnRecord[];
  rows: RowRecord[];
  created_at: string;
}

export interface ColumnRecord {
  id: string;
  name: string;
  data_type: string;
  is_nullable: boolean;
  default_value: string | null;
  position: number;
}

export interface RowRecord {
  id: string;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface ApiKeyRecord {
  id: string;
  user_id: string;
  database_id: string;
  key_value: string;
  name: string;
  is_active: boolean;
  last_used_at: string | null;
  created_at: string;
}

export interface QueryLogRecord {
  id: string;
  user_id: string;
  database_id: string;
  method: string;
  endpoint: string;
  status_code: number;
  response_time_ms: number | null;
  request_body: any;
  created_at: string;
}

export interface CopyrightStrike {
  id: string;
  user_id: string;
  content_type: string;
  content_id: string;
  content_name: string;
  strike_reason: string;
  status: "active" | "resolved" | "dismissed";
  created_at: string;
}

export interface MainWebDB {
  users: User[];
  databases: DatabaseRecord[];
  api_keys: ApiKeyRecord[];
  query_logs: QueryLogRecord[];
  copyright_strikes: CopyrightStrike[];
}

const DB_KEY = "mainwebdb";

function getDefaultDB(): MainWebDB {
  return {
    users: [],
    databases: [],
    api_keys: [],
    query_logs: [],
    copyright_strikes: [],
  };
}

export function loadDB(): MainWebDB {
  try {
    const raw = localStorage.getItem(DB_KEY);
    if (!raw) {
      const db = getDefaultDB();
      saveDB(db);
      return db;
    }
    const parsed = JSON.parse(raw);
    // Ensure all keys exist
    return {
      users: parsed.users || [],
      databases: parsed.databases || [],
      api_keys: parsed.api_keys || [],
      query_logs: parsed.query_logs || [],
      copyright_strikes: parsed.copyright_strikes || [],
    };
  } catch {
    const db = getDefaultDB();
    saveDB(db);
    return db;
  }
}

export function saveDB(db: MainWebDB): void {
  localStorage.setItem(DB_KEY, JSON.stringify(db));
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : 
    'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
}

export function generateApiKey(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return 'gfx_' + Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
}

export function hashPassword(password: string): string {
  // Simple hash for localStorage - NOT production security
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return 'h_' + Math.abs(hash).toString(36) + '_' + btoa(password).slice(0, 12);
}

export function verifyPassword(password: string, hashed: string): boolean {
  return hashPassword(password) === hashed;
}

// Export/download the mainwebdb.json file
export function exportDB(): void {
  const db = loadDB();
  const blob = new Blob([JSON.stringify(db, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'mainwebdb.json';
  a.click();
  URL.revokeObjectURL(url);
}

// Import from a mainwebdb.json file
export function importDB(file: File): Promise<void> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        saveDB(data);
        resolve();
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

// Auto copyright detection
export function autoCopyrightCheck(db: MainWebDB, userId: string, contentName: string, contentId: string, contentType: string): CopyrightStrike | null {
  // Check for duplicate content names within the same user's databases
  const existingDbs = db.databases.filter(d => d.user_id !== userId);
  for (const existingDb of existingDbs) {
    if (existingDb.name.toLowerCase() === contentName.toLowerCase()) {
      const strike: CopyrightStrike = {
        id: generateId(),
        user_id: userId,
        content_type: contentType,
        content_id: contentId,
        content_name: contentName,
        strike_reason: `Duplicate content detected: "${contentName}" already exists under another user.`,
        status: "active",
        created_at: new Date().toISOString(),
      };
      db.copyright_strikes.push(strike);
      saveDB(db);
      return strike;
    }
  }
  return null;
}
