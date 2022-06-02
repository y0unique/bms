import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";
import {sendEmail} from "../email/sendEmail";
var ObjectId = require('mongodb').ObjectId;

export default async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 401;
        res.json({ message: "You are not signed in." });
        return;
    }
    if (req.method === "POST") { 
        console.log(req.body);
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const inquiries = db.collection("inquiries");
        let o_id = new ObjectId(req.body);
        
        //Update document with o_id
        inquiries.updateOne(
            { _id: o_id },
            { $set: {
                purpose: req.body.purpose,
                report: req.body.report,
                status: req.body.status,
                type: req.body.type,
                dateInquired: req.body.dateInquired,
                status: req.body.status,
            }},
            function(err, result) {
                if (err) throw err;
                console.log("1 document updated");
                console.log(result);
            }
        );
         // Find account in accounts collection
         const accounts = db.collection("accounts");
         const found = await accounts.findOne({
             resident: ObjectId(req.body.resident._id)
         });

        if (req.body.status == "active" && req.body.purpose == "Certificate") {
          
            const documents = db.collection("documents");
            const result = await documents.insertOne({
                type: req.body.type,
                dateSubmitted:  new Date(),
                status: "active",
                resident: ObjectId(req.body.resident._id),
                type: req.body.type,
            });
           
            // Send email to resident
            sendEmail(req.body.resident.email, "Document Issued", "You have successfully issued a document.");
             // Send notification to resident
             const notification = db.collection("notifications");
             const result2 = await notification.insertOne({
                 account: ObjectId(found._id),
                 description: "Barangay Certificate has been issued.",
                 read: false,
                 createdDate: new Date(),
             });
            return res.json(result)
        }
        if (req.body.status == "active" && req.body.purpose == "Blotter") {
          
            const blotter = db.collection("blotter");
            const result = await blotter.insertOne({
                dateRecord:  new Date(),
                status: "active",
                resident: ObjectId(req.body.resident._id),
                report: req.body.report,
            });
            console.log(result);
           

            // Send notification to resident
            const notification = db.collection("notifications");
            const result2 = await notification.insertOne({
                account: ObjectId(found._id),
                description: "You have a new blotter record.",
                read: false,
                createdDate: new Date(),
            });
          

            return res.json(result)
        }

        
    }
    

}