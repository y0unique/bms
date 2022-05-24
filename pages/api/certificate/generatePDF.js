import { getSession } from "next-auth/react";
import {  PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import  fs  from 'fs/promises';
import moment from "moment";
import clientPromise from "../../../lib/mongodb";
var ObjectId = require('mongodb').ObjectId;

export default async (req, res) => {
    const session = await getSession({ req });
    if (!session) {
        res.statusCode = 401;
        res.json({ message: "You are not signed in." });
        return;
    }
   
    // Handle POST request
    if (req.method === "POST") {
      
       // Check if therer is resident object in the request body
        if (!req.body.resident) {
            res.statusCode = 400;
            res.json({ message: "No resident object in the request body" });
            return;
        }

        // Find the id of the resident in the database 
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const collection = db.collection("resident");
      
        // Find resident by id  
        const resident = await collection.findOne({ _id:  ObjectId(req.body.resident) });
        // then check if the resident is found
        console.log(resident);
        // Get the age of the resident by subtracting the birthdate from the current date
        const age = moment().diff(resident.birthdate, "years");
      
        const pdfData = await fs.readFile('./public/CERTIFICATE.pdf');
        if (!pdfData) {
            res.statusCode = 500;
            res.json({ message: "Could not read file" });
            return;
        }
        
        const pdfDoc = await PDFDocument.load(pdfData);
        const timesRomanFont = await pdfDoc.embedFont(StandardFonts.TimesRoman)
        const pages = pdfDoc.getPages()
        const fontSize = 12;
        pages[0].drawText(`${resident.firstname} ${resident.middlename} ${resident.lastname}`, {
            x: 370,
            y: 690,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })
          pages[0].drawText("Single", {
            x: 210,
            y: 665,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })
          pages[0].drawText(`${age}`, {
            x: 273,
            y: 665,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })
          pages[0].drawText(`${resident.address}`, {
            x: 475,
            y: 665,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })
          // find today's date day
          const today = new Date();
          const day = today.getDate();
          // find today's date month text using moment.js
          const month = moment().format("MMMM");
          pages[0].drawText(day.toString(), {
            x: 295,
            y: 526,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })
          pages[0].drawText(month.toString(), {
            x: 360,
            y: 526,
            size: fontSize,
            font: timesRomanFont,
            color: rgb(0, 0, 0),
          })
        const pdfBytes = await pdfDoc.save()
       
        // Save the PDF to a file
        await fs.writeFile('./public/CERTIFICATE_modified.pdf', pdfBytes);
        
        // Send the filename to the client and display a link to the file
        // Set cors headers to allow the client to access the file
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'inline; filename="CERTIFICATE.pdf"');
        res.setHeader('Access-Control-Allow-Origin', '*');

        res.json({
            filename: 'CERTIFICATE_modified.pdf',
            url: `/CERTIFICATE_modified.pdf`,
        });

    }




}