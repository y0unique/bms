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

    // Handle POST request
    console.log(req.body._id);
    if (req.method === "POST") {
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const inquiries = db.collection("inquiries");
        // update status to inactive
   
        
        var id = req.body._id.map(function(id) { return ObjectId(id); });

        const result = await inquiries.updateMany({
            _id: {
                $in: id
            }
        }, {
            $set: {
                status: "inactive"
            }
        });
        // send result
        console.log(result);
        return res.json({ message: result });
        
    }




}