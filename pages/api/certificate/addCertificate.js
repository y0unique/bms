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
    if (req.method === "POST") {
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const collection = db.collection("documents");
        // Insert document into collection
        // Check if one of the fields is empty
        if (
            req.body.type === "" ||
            req.body.dateSubmitted === ""
        ) {
            res.statusCode = 400;
            res.json({ message: "One of the fields is empty." });
            return;
        }
        const result = await collection.insertOne({
            type: req.body.type,
            dateSubmitted: req.body.dateSubmitted,
            status: "active",
            resident: req.body.resident,
        });
        // send result
        console.log(result);
        return res.json({message:result})

    }




}