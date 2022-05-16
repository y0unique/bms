import { Server } from "socket.io";
import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });
  if (!session) {
    res.statusCode = 401;
    res.json({ message: "You are not signed in." });
    return;
  }
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server(res.socket.server);
    res.socket.server.io = io;
   
  }
  
  res.end();
};
