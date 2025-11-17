import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URL;
let client;

export default async function handler(req, res) {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }

    const db = client.db("rivero");   // database otomatik oluşur
    const col = db.collection("visitors"); // collection otomatik oluşur

    const ip = req.headers["x-forwarded-for"]?.split(",")[0]
            || req.socket.remoteAddress;

    const userAgent = req.headers["user-agent"];
    const date = new Date();

    await col.insertOne({ ip, userAgent, date });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "server error" });
  }
}
