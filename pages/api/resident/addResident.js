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
        const resident = db.collection("resident");
        // Insert document into collection
        // Check if one of the fields is empty
        if (
            req.body.firstname === "" ||
            req.body.lastname === "" ||
            req.body.residentialType === "" ||
            req.body.address === "" || 
            req.body.birthdate === "" ||
            req.body.residencyDate === "" ||
            req.body.gender === "" 
        ) {
            res.statusCode = 400;
            res.json({ message: "One of the fields is empty." });
            return;
        }
        const result = await resident.insertOne({
            firstname: req.body.firstname,
            middlename: req.body.middlename,    
            lastname: req.body.lastname,
            residentialType: req.body.residentialType,
            address: req.body.address,
            birthdate: req.body.birthdate,
            gender: req.body.gender,
            residencyDate: req.body.residencyDate,
            status: "active"
        });
        // send result
        return res.json({message:result})

    }




}