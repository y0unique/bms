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
    if (req.method === "POST") { 
        console.log(req.body.id);
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const collection = db.collection("inquiries");
        let o_id = new ObjectId(req.body);
        const inquiries = await collection.findOne({_id:o_id});
        
        console.log(inquiries);
        return res.json(inquiries);
    }
    

}