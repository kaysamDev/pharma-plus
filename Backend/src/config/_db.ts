import dotenv from "dotenv";
dotenv.config();

import { MongoClient, ServerApiVersion, Db } from "mongodb";

const uri = process.env.MONGODB_URI as string;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let clientPromise: Promise<MongoClient> | null = null;

export async function connectDb(): Promise<MongoClient> {
  if (!clientPromise) {
    clientPromise = client.connect();
  }
  await clientPromise;
  return client;
}

export async function getDb(dbName = "pharmaplus"): Promise<Db> {
  await connectDb();
  return client.db(dbName);
}

export async function closeDb(): Promise<void> {
  await client.close();
  clientPromise = null;
}
