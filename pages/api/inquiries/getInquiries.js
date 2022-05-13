import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
var ObjectId = require('mongodb').ObjectId;

export default async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 401;
        res.json({ message: "You are not signed in." });
        return;
    }
    const client = await clientPromise;
    const db = client.db("barangayDB");
    const collection = db.collection("inquiries");
    // filter document with active 
    // Find all inquiries wuth active and pending status
    const inquiry = await collection.find({status: {$in: ["active", "pending"]}}).toArray();
    
    // If there is error, return error message
    if (inquiry.length === 0) {
        res.statusCode = 404;
        res.json({ message: "No Inquiry record found." });
        return;
    }

   
    // Loop through the inquiry records
    // Find the resident name
    // Push the name to the inquiry record
    for (let i = 0; i < inquiry.length; i++) {
        const resident = await findResident(db, inquiry[i].resident);
        if (!resident) continue;
        inquiry[i].resident = resident;
    }
    // If there is no error, return the data
    res.statusCode = 200;
  
    return res.json(inquiry);
}

async function findResident(db, id ) {
    const collection = db.collection("resident");
    let o_id = new ObjectId(id);
    const resident = await collection.findOne({_id:o_id});
    return resident;
}