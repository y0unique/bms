import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
var ObjectId = require("mongodb").ObjectId;

export default async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 401;
        res.json({ message: "You are not signed in." });
        return;
    }
    console.log(session);
    // Handle POST request
    if (req.method === "GET") {
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const notification = db.collection("notifications");
        // Find notification by user.user.resident
        const result = await notification.find({
            account: ObjectId(session.user.user.id)
        }).toArray();
        
        return res.json(result)
    }
}