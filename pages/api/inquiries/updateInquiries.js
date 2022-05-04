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
        
        //Update document with o_id
        collection.updateOne(
            { _id: o_id },
            { $set: {
                purpose: req.body.purpose,
                report: req.body.report,
                status: req.body.status,
                type: req.body.type,
                dateInquired: req.body.dateInquired,
            }},
            function(err, result) {
                if (err) throw err;
                console.log("1 document updated");
                console.log(result);
                return res.json(result);
            }
        );
            
        
    }
    

}