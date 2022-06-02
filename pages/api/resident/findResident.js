import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";

var ObjectID = require("mongodb").ObjectID;

export default async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 401;
        res.json({ message: "You are not signed in." });
        return;
    }
    const client = await clientPromise;
    const db = client.db("barangayDB");
    const collection = db.collection("resident");
    const residents = await collection.findOne({ _id: ObjectID(session.user.user.resident) });
    if (!residents) {
        res.statusCode = 404;
        res.json({ message: "Resident not found." });
        return;
    }
    console.log(residents);
    res.statusCode = 200;
    return res.json(residents);
}