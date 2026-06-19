import process from "node:process";

interface DbDocument {
  [key: string]: unknown;
  createdAt: string;
}

let client: unknown = null;
let db: unknown = null;
let connected = false;
let connectionAttempted = false;

async function getDb(): Promise<{ collection: (name: string) => Collection } | null> {
  if (connected && db) return db as { collection: (name: string) => Collection };
  if (connectionAttempted) return null;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    connectionAttempted = true;
    console.warn("[db] MONGODB_URI not set — form submissions will not be persisted.");
    return null;
  }

  try {
    const { MongoClient } = await import("mongodb");
    client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
    await (client as InstanceType<typeof MongoClient>).connect();
    db = (client as InstanceType<typeof MongoClient>).db();
    connected = true;
    console.log("[db] Connected to MongoDB.");
    return db as { collection: (name: string) => Collection };
  } catch (err) {
    connectionAttempted = true;
    console.warn("[db] MongoDB connection failed — persistence unavailable:", err);
    return null;
  }
}

interface Collection {
  insertOne: (doc: DbDocument) => Promise<{ insertedId: unknown }>;
  findOne: (filter: Record<string, unknown>) => Promise<DbDocument | null>;
}

export async function insertDocument(
  collectionName: string,
  doc: Record<string, unknown>,
): Promise<{ persisted: boolean }> {
  const database = await getDb();
  if (!database) {
    console.warn(`[db] Skipping insert to ${collectionName} — no database connection.`);
    return { persisted: false };
  }

  try {
    const collection = database.collection(collectionName);
    await collection.insertOne({ ...doc, createdAt: new Date().toISOString() });
    return { persisted: true };
  } catch (err) {
    console.error(`[db] Insert to ${collectionName} failed:`, err);
    return { persisted: false };
  }
}

export async function findByEmail(collectionName: string, email: string): Promise<boolean> {
  const database = await getDb();
  if (!database) return false;

  try {
    const collection = database.collection(collectionName);
    const existing = await collection.findOne({ email });
    return existing !== null;
  } catch {
    return false;
  }
}
