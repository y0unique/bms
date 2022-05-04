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
        const inquiries = db.collection("inquiries");
        // Insert document into collection
        // Check if one of the fields is empty
        if (
            req.body.purpose === "" ||
            req.body.report === "" ||
            req.body.status === "" || 
            req.body.dateInquired === "" ||
            req.body.type === "" 
        ) {
            res.statusCode = 400;
            res.json({ message: "One of the fields is empty." });
            return;
        }
        const result = await inquiries.insertOne({
            purpose: req.body.purpose,
            report: req.body.report,
            dateInquired: req.body.dateInquired,
            type: req.body.type,
            status: "pending"
        });
        // send result
        return res.json({message:result})

    }




}