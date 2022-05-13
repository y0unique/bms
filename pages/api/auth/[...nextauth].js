import NextAuth from "next-auth";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "../../../lib/mongodb";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: {  label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        //Connect to database
        
        const client = await clientPromise;
        const db = client.db("barangayDB");
        const collection = db.collection("accounts");
        const user = await collection.findOne({
          username: credentials.username,
        });
        if (!user) {
          return Promise.reject(new Error("Invalid username or password"));
        }
        if (user.password == credentials.password) {     
          return {
            user: {
              id: user._id,
              username: user.username,  
              roles: user.roles,  
              resident: user.resident,     
          }};

        }
        else {
          // Reject the promise with an error
          return Promise.reject(new Error("Invalid username or password"));
        }
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user = token.user;
      if (token?.resident) {
        session.user.resident = token.resident
      }
      if (token?.roles) {
        session.user.roles = token.roles
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.user = user;
      }
      if (user?.roles) {
        token.roles = user.roles
      }
      return token;
    },
  },
  jwt: {
    secret: "test",
    encryption: true,
  },
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/auth/login",
  },
});
