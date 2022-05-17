import Pusher from "pusher";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const pusher = new Pusher({
  appId: "1410317",
  key: "e6f3ef5def7a9cba57fc",
  secret: "8832d404c4a17df70535",
  cluster: "ap1",
  useTLS: true,
});

export default async function handler(req, res) {
  const { msg, user } = req.body;
  // Chech if message includes "chat with ai"
  const response = await pusher.trigger("chat", "chat-event", {
    msg,
    user,
  });


  if (msg.includes("ai")) {
    // send request to api/chat/openai
    const response = await openai.createCompletion("text-davinci-002", {
      prompt:`The following is a conversation with an AI assistant. The assistant is helpful, creative, clever, and very friendly.\n ${req.body.msg}`,
      temperature: 0.9,
      max_tokens: 150,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0.6,
    });
    
    const msg =  response?.data?.choices[0]?.text;
    // send response to pusher
    pusher.trigger("chat", "chat-event", {
        msg,
        user: "OpenAI"
    });
   
  }

  res.json({ message: "completed" });
}
