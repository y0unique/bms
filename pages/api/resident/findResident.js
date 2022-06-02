import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";


var ObjectId = require("mongodb").ObjectId;


export async function findResident(residentID) {
  const client = await clientPromise;
  const db = client.db("barangayDB");
  const collection = db.collection("resident");
  const resident = await collection.findOne({
    _id: ObjectId(residentID),
  });
  if (!resident) { return;}
  return resident;
}
