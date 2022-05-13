import clientPromise from "../../../lib/mongodb";
import { getSession } from "next-auth/react";

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
    // filter document with active status
    const residents = await collection.find({ status: "active" }).toArray();
    // If there is error, return error message
    if (residents.length === 0) {
        res.statusCode = 404;
        res.json({ message: "No resident record found." });
        return;
    }

    // Get the birthdate of the residents
    const birthdate = residents.map(resident => {
        return resident.birthdate;
    });

    // Subtract the birthdate from the current date
    const age = birthdate.map(birthdate => {
        const today = new Date();
        const birthDate = new Date(birthdate);
        const age = today.getFullYear() - birthDate.getFullYear();
        const month = today.getMonth() - birthDate.getMonth();
        const day = today.getDay() - birthDate.getDay();
        if (month < 0 || month === 0 && today.getDate() < birthDate.getDate()) {
            return age - 1;
        } else {
            return age;
        }
    }
    );
    // Get the age bracket of the residents
    // From age 1 to age 17
    // From age 18 to age 35
    // From age 36 to age 59 (age 60 and above)
   
    const ageBracket = age.map(age => {
        if (age < 18) {
            return "Below 18";
        } else if (age < 36) {
            return "18 to 35";
        } else if (age < 60) {
            return "36 to 59";
        } else {
            return "Above 60";
        }
    });

    // Create a group by age bracket
    // Insert the age bracket into an array
    // Insert the count into an array object that conatins name and value 
    const ageBracketGroup = ageBracket.reduce((acc, curr) => {
        if (!acc[curr]) {
            acc[curr] = 0;
        }
        acc[curr]++;
        return acc;
    }, {});
    // Create an array of objects
    const ageBracketGroupArray = [];
    for (let key in ageBracketGroup) {
        ageBracketGroupArray.push({ name: key, value: ageBracketGroup[key] });
    }
    // Return the array of objects
    return res.json(ageBracketGroupArray);
  
}
   
