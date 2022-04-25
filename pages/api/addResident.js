import clientPromise from "../../lib/mongodb";
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
        const resident = db.collection("resident");
        // Insert document into collection
        // Check if one of the fields is empty
        if (
            req.body.firstname === "" ||
            req.body.middlename === "" ||
            req.body.lastname === "" ||
            req.body.address === ""
        ) {
            res.statusCode = 400;
            res.json({ message: "One of the fields is empty." });
            return;
        }
        const result = await resident.insertOne({
            firstname: req.body.firstname,
            middlename: req.body.middlename,    
            lastname: req.body.lastname,
            address: req.body.address,
            age: req.body.age,
            gender: req.body.gender,
            residencyDate: req.body.residencyDate,
            status: "active"
        });
        // send result
        return res.json({message:result})

    }




}