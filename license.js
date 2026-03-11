import db from "../database/db.js";

export default async function handler(req, res) {

  const { serial } = req.body;

  await db.query(
    "INSERT INTO licenses (serial) VALUES (?)",
    [serial]
  );

  res.json({
    status:"license created"
  });

}