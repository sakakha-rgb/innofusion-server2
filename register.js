import db from "../database/db.js";

export default async function handler(req, res) {

  const { serial,email } = req.body;

  await db.query(
    "INSERT INTO users (email,serial) VALUES (?,?)",
    [email,serial]
  );

  res.json({
    status:"registered"
  });

}