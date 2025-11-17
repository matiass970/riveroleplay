import { MongoClient } from "mongodb";

export const config = {
  runtime: "nodejs"
};

const uri = process.env.MONGO_URL;
let client;

export default async function handler(req, res) {
  try {
    if (!client) {
      client = new MongoClient(uri);
      await client.connect();
    }

    const db = client.db("rivero");
    const col = db.collection("visitors");

    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] ||
      req.socket.remoteAddress;

    const userAgent = req.headers["user-agent"];
    const date = new Date();

    await col.insertOne({
      ip: ip,
      userAgent: userAgent,
      date: date,
    });

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error("API ERROR:", err);
    res.status(500).json({ error: "server error" });
  }
}
