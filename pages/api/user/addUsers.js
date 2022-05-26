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
        const users = db.collection("accounts");
        // Insert document into collection
        // Check if one of the fields is empty
        if (
            req.body.username === "" ||
            req.body.password === "" ||
            req.body.roles === ""
        ) {
            res.statusCode = 400;
            res.json({ message: "One of the fields is empty." });
            return;
        }
        const result = await users.insertOne({
            username: req.body.username,
            password: req.body.password,    
            roles: req.body.roles,
            status: "active"
        });
        // send result
        return res.json({message:result})

    }




}