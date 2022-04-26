import clientPromise from "../../lib/mongodb";
import { getSession } from "next-auth/react";
var ObjectId = require('mongodb').ObjectId; 

export default async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 401;
        res.json({ message: "You are not signed in." });
        return;
    }
    if (req.method === "POST") { 
        console.log(req.body.id);
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const collection = db.collection("resident");
        let o_id = new ObjectId(req.body);
        
        //Update document with o_id
        collection.updateOne(
            { _id: o_id },
            { $set: {
                firstname: req.body.firstname,
                middlename: req.body.middlename,
                lastname: req.body.lastname,
                birthdate: req.body.birthdate,
                residencyDate: req.body.residencyDate,
                address: req.body.address,
            }},
            function(err, result) {
                if (err) throw err;
                console.log("1 document updated");
                console.log(result);
                return res.json(result);
            }
        );
            
        
    }
    

}