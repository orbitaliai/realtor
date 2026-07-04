import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

export interface Property {
  id: number;
  title: string;
  description: string;
  neighborhood: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqm: number;
  type: string;
  createdAt: string;
}

export type PropertyInput = Omit<Property, "id" | "createdAt">;

export const PROPERTY_TYPES = [
  "Apartment",
  "Penthouse",
  "Loft",
  "Studio",
  "Townhouse",
];

export const NEIGHBORHOODS = [
  "Eixample",
  "Gràcia",
  "El Born",
  "Barri Gòtic",
  "Poblenou",
  "Sarrià-Sant Gervasi",
  "Sant Antoni",
  "La Barceloneta",
  "Les Corts",
  "El Raval",
  "Poble-sec",
  "Horta-Guinardó",
];

const STREETS = [
  "Carrer de Balmes",
  "Carrer de Mallorca",
  "Passeig de Gràcia",
  "Carrer del Consell de Cent",
  "Rambla de Catalunya",
  "Carrer de Provença",
  "Carrer de Verdi",
  "Carrer de la Princesa",
  "Carrer d'Aragó",
  "Avinguda Diagonal",
  "Carrer de Muntaner",
  "Carrer de Pujades",
  "Carrer de Blai",
  "Carrer Gran de Gràcia",
  "Carrer de Sardenya",
  "Passeig de Sant Joan",
];

// Rough €/sqm multiplier per neighborhood to make prices feel plausible.
const PRICE_PER_SQM: Record<string, number> = {
  Eixample: 5200,
  Gràcia: 4600,
  "El Born": 5400,
  "Barri Gòtic": 4800,
  Poblenou: 4400,
  "Sarrià-Sant Gervasi": 5800,
  "Sant Antoni": 4700,
  "La Barceloneta": 5000,
  "Les Corts": 4500,
  "El Raval": 3600,
  "Poble-sec": 3900,
  "Horta-Guinardó": 3200,
};

const ADJECTIVES = [
  "Bright",
  "Charming",
  "Renovated",
  "Spacious",
  "Modern",
  "Cozy",
  "Elegant",
  "Sunny",
  "Classic",
  "Stylish",
];

const FEATURES = [
  "with a private terrace",
  "with balcony and city views",
  "steps from the metro",
  "in a modernist building",
  "with high ceilings and original tiles",
  "near the beach",
  "overlooking a quiet plaza",
  "with a fully equipped kitchen",
  "next to the market",
  "with abundant natural light",
];

// Deterministic PRNG so the seed data is stable across runs.
function mulberry32(seed: number) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seedProperties(db: Database.Database) {
  const rand = mulberry32(20260704);
  const pick = <T>(arr: T[]) => arr[Math.floor(rand() * arr.length)];
  const between = (min: number, max: number) =>
    Math.floor(rand() * (max - min + 1)) + min;

  const insert = db.prepare(
    `INSERT INTO properties (title, description, neighborhood, address, price, bedrooms, bathrooms, sqm, type)
     VALUES (@title, @description, @neighborhood, @address, @price, @bedrooms, @bathrooms, @sqm, @type)`,
  );

  const insertAll = db.transaction(() => {
    for (let i = 0; i < 100; i++) {
      const neighborhood = pick(NEIGHBORHOODS);
      const type = pick(PROPERTY_TYPES);
      const adjective = pick(ADJECTIVES);
      const feature = pick(FEATURES);
      const sqm =
        type === "Studio"
          ? between(28, 55)
          : type === "Penthouse"
            ? between(90, 220)
            : between(50, 180);
      const bedrooms =
        type === "Studio" ? 0 : Math.min(between(1, 5), Math.floor(sqm / 25));
      const bathrooms = Math.max(1, Math.min(between(1, 3), bedrooms));
      const basePrice = sqm * PRICE_PER_SQM[neighborhood];
      const price = Math.round((basePrice * (0.85 + rand() * 0.3)) / 1000) * 1000;

      insert.run({
        title: `${adjective} ${type.toLowerCase()} in ${neighborhood}`,
        description: `${adjective} ${sqm} m² ${type.toLowerCase()} in the heart of ${neighborhood}, ${feature}. A great opportunity to live in one of Barcelona's most sought-after areas.`,
        neighborhood,
        address: `${pick(STREETS)}, ${between(1, 250)}`,
        price,
        bedrooms,
        bathrooms,
        sqm,
        type,
      });
    }
  });

  insertAll();
}

export interface Lead {
  id: number;
  propertyId: number;
  propertyTitle: string;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
}

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;

  const dataDir = path.join(process.cwd(), "data");
  fs.mkdirSync(dataDir, { recursive: true });

  db = new Database(path.join(dataDir, "realtor.db"));
  db.pragma("journal_mode = WAL");
  db.exec(`
    CREATE TABLE IF NOT EXISTS properties (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      neighborhood TEXT NOT NULL,
      address TEXT NOT NULL,
      price INTEGER NOT NULL,
      bedrooms INTEGER NOT NULL,
      bathrooms INTEGER NOT NULL,
      sqm INTEGER NOT NULL,
      type TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    );
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      propertyId INTEGER NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT (datetime('now'))
    )
  `);

  const count = db
    .prepare("SELECT COUNT(*) AS count FROM properties")
    .get() as { count: number };
  if (count.count === 0) {
    seedProperties(db);
  }

  return db;
}

export interface PropertySearchParams {
  q?: string;
  type?: string;
  neighborhood?: string;
  bedrooms?: number;
  bathrooms?: number;
  minPrice?: number;
  maxPrice?: number;
  minSqm?: number;
  maxSqm?: number;
  page?: number;
  limit?: number;
}

export interface PropertySearchResult {
  data: Property[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export function searchProperties(params: PropertySearchParams): PropertySearchResult {
  const {
    q,
    type,
    neighborhood,
    bedrooms,
    bathrooms,
    minPrice,
    maxPrice,
    minSqm,
    maxSqm,
    page = 1,
    limit = 20,
  } = params;

  const conditions: string[] = [];
  const args: unknown[] = [];

  if (q) {
    conditions.push("(title LIKE ? OR description LIKE ?)");
    args.push(`%${q}%`, `%${q}%`);
  }
  if (type) {
    conditions.push("type = ?");
    args.push(type);
  }
  if (neighborhood) {
    conditions.push("neighborhood = ?");
    args.push(neighborhood);
  }
  if (bedrooms !== undefined) {
    conditions.push("bedrooms = ?");
    args.push(bedrooms);
  }
  if (bathrooms !== undefined) {
    conditions.push("bathrooms = ?");
    args.push(bathrooms);
  }
  if (minPrice !== undefined) {
    conditions.push("price >= ?");
    args.push(minPrice);
  }
  if (maxPrice !== undefined) {
    conditions.push("price <= ?");
    args.push(maxPrice);
  }
  if (minSqm !== undefined) {
    conditions.push("sqm >= ?");
    args.push(minSqm);
  }
  if (maxSqm !== undefined) {
    conditions.push("sqm <= ?");
    args.push(maxSqm);
  }

  const where = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const safeLimit = Math.min(Math.max(1, limit), 100);
  const safePage = Math.max(1, page);
  const offset = (safePage - 1) * safeLimit;

  const db = getDb();
  const total = (db.prepare(`SELECT COUNT(*) AS count FROM properties ${where}`).get(...args) as { count: number }).count;
  const data = db.prepare(`SELECT * FROM properties ${where} ORDER BY createdAt DESC, id DESC LIMIT ? OFFSET ?`).all(...args, safeLimit, offset) as Property[];

  return {
    data,
    total,
    page: safePage,
    limit: safeLimit,
    pages: Math.ceil(total / safeLimit),
  };
}

export function getAllProperties(): Property[] {
  return getDb()
    .prepare("SELECT * FROM properties ORDER BY createdAt DESC, id DESC")
    .all() as Property[];
}

export function getProperty(id: number): Property | undefined {
  return getDb()
    .prepare("SELECT * FROM properties WHERE id = ?")
    .get(id) as Property | undefined;
}

export function createProperty(input: PropertyInput): number {
  const result = getDb()
    .prepare(
      `INSERT INTO properties (title, description, neighborhood, address, price, bedrooms, bathrooms, sqm, type)
       VALUES (@title, @description, @neighborhood, @address, @price, @bedrooms, @bathrooms, @sqm, @type)`,
    )
    .run(input);
  return Number(result.lastInsertRowid);
}

export function updateProperty(id: number, input: PropertyInput): void {
  getDb()
    .prepare(
      `UPDATE properties
       SET title = @title, description = @description, neighborhood = @neighborhood,
           address = @address, price = @price, bedrooms = @bedrooms,
           bathrooms = @bathrooms, sqm = @sqm, type = @type
       WHERE id = @id`,
    )
    .run({ ...input, id });
}

export function deleteProperty(id: number): void {
  getDb().prepare("DELETE FROM properties WHERE id = ?").run(id);
}

const TYPE_KEYWORDS: Record<string, string> = {
  Apartment: "apartment,interior,modern",
  Penthouse: "penthouse,luxury,rooftop",
  Loft: "loft,interior,industrial",
  Studio: "studio,apartment,cozy",
  Townhouse: "townhouse,house,facade",
};

export function propertyImage(
  id: number,
  type: string,
  width = 800,
  height = 600,
): string {
  const keywords = TYPE_KEYWORDS[type] ?? "house,real,estate";
  return `https://loremflickr.com/${width}/${height}/${keywords}?lock=${id}`;
}

export function createLead(propertyId: number, name: string, email: string, phone: string): void {
  getDb()
    .prepare("INSERT INTO leads (propertyId, name, email, phone) VALUES (?, ?, ?, ?)")
    .run(propertyId, name, email, phone);
}

export function getLeadsForProperty(propertyId: number): Lead[] {
  return getDb()
    .prepare(
      `SELECT l.*, p.title AS propertyTitle
       FROM leads l JOIN properties p ON p.id = l.propertyId
       WHERE l.propertyId = ? ORDER BY l.createdAt DESC`,
    )
    .all(propertyId) as Lead[];
}

export function getAllLeads(): Lead[] {
  return getDb()
    .prepare(
      `SELECT l.*, p.title AS propertyTitle
       FROM leads l JOIN properties p ON p.id = l.propertyId
       ORDER BY l.createdAt DESC`,
    )
    .all() as Lead[];
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(price);
}
