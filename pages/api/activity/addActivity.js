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
        const activity = db.collection("activies");
        // Insert document into collection
        // Check if one of the fields is empty
        if (
            req.body.what === "" ||
            req.body.where === "" ||
            req.body.when === "" || 
            req.body.why === "" ||
            req.body.how === "" ||
            req.body.who === "" 
        ) {
            res.statusCode = 400;
            res.json({ message: "One of the fields is empty." });
            return;
        }
        console.log(req.body);
        const result = await activity.insertOne({
            what: req.body.what,
            where: req.body.where,    
            why: req.body.why,
            how: req.body.how,
            who: req.body.who,
            when: req.body.when,
            status: "active"
        });
        // send result
        console.log(req.body);
        return res.json({message:result})

    }




}