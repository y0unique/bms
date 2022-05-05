import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";

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
        const collection = db.collection("blotter");
        // Insert document into collection
        // Check if one of the fields is empty
        if (
            req.body.report === "" ||
            req.body.dateRecord === ""
        ) {
            res.statusCode = 400;
            res.json({ message: "One of the fields is empty." });
            return;
        }
        const result = await collection.insertOne({
            report: req.body.report,
            dateRecord: req.body.dateRecord,
            status: "active"
        });
        // send result
        return res.json({message:result})

    }




}