import db from "../database/db.js";

export default async function handler(req, res) {

  const { serial } = req.query;

  const [rows] = await db.query(
    "SELECT * FROM licenses WHERE serial=?",
    [serial]
  );

  if(rows.length === 0){
    return res.status(404).json({
      status:"invalid"
    });
  }

  res.json({
    status:"valid",
    product:"INNO FUSION"
  });

}