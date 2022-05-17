import {
  ActionIcon, Avatar, Card, createStyles, Grid,
  Group, Paper, ScrollArea, Text, TextInput, Title
} from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import Pusher from "pusher-js";
import { useEffect, useRef, useState } from "react";
import { Send } from "tabler-icons-react";
import Layout from "../../components/Layout";

const useStyles = createStyles((theme) => ({
  send: {
    position: "absolute",
    bottom: 10,
    left: 10,
    right: 10,
    minWidth: "95%",
  },
}));

const Chats = () => {
  const inputRef = useRef(null);
  const { classes, cx } = useStyles();
  const { data: session } = useSession();
  const [msg, setMsg] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(async () => {
    
    const pusher = new Pusher('e6f3ef5def7a9cba57fc', {
      cluster: 'ap1'
    });

    const channel = pusher.subscribe('chat');
    channel.bind('chat-event', function(data) {
      chat.push(data);
      setChat([...chat]);
    });

    return () => {
      pusher.unsubscribe("chat");
    };
  }, []);

  const sendMessage = async () => {
    const user = session.user.user.username;
    if (msg) {
      // build message obj
      const message = {
        user,
        msg,
      };

      // dispatch message to other users
      const resp = await fetch("/api/chat/pusher", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      // reset field if OK
      if (resp.ok) setMsg("");
    }

    // focus after click
    inputRef?.current?.focus();
  };
  return (
    <Layout>
      {!session && (
        <>
          <Grid>
            <Grid.Col>
              <Text>
                You are not signed in. Sign in{" "}
                <Link href="/auth/login">here</Link>
              </Text>
            </Grid.Col>
          </Grid>
        </>
      )}
      {session && (
        <>
          <Grid mt={12}>
            <Grid.Col span={12}>
              <Card>
                <Title mb={6}>Chats</Title>

                <Text>View all chats.</Text>
              </Card>
            </Grid.Col>

            <Grid.Col>
              <Card
                sx={{
                  minHeight: "600px",
                }}
              >
                <Title mb={6}> Chat Window</Title>
                <ScrollArea>
                  <div style={{ height: 456 }}>
                    {chat.map((chat) => (
                      <>
                        
                          {chat.user === session.user.user.username && (
                            <>
                            <Group mt={5} position="right" spacing="xs">
                              <Paper
                                sx={{
                                  flexDirection: "column",
                                  minWidth: "300px",
                                  padding: "10px",
                                  borderRadius: "8px",
                                }}
                              >
                                <Text weight={700}>Me</Text>
                                <Text> {chat.msg}</Text>
                              </Paper>
                              <Avatar
                                radius="xl"
                                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                              />
                              </Group>
                            </>
                          )}
                          {chat.user !== session.user.user.username && (
                            <>
                             <Group mt={5} position="left" spacing="xs">
                              <Avatar
                                radius="xl"
                                src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
                              />
                               <Paper
                                sx={{
                                  flexDirection: "column",
                                  minWidth: "300px",
                                  padding: "10px",
                                  borderRadius: "8px",
                                }}
                              >
                                <Text weight={700}>{chat.user}</Text>
                                <Text> {chat.msg}</Text>
                              </Paper>
                              </Group>
                            </>
                          )}
                     
                      </>
                    ))}
                  </div>
                </ScrollArea>
                <TextInput
                  className={classes.send}
                  placeholder="Type a message..."
                  rightSection={
                    <ActionIcon onClick={sendMessage}>
                      <Send />
                    </ActionIcon>
                  }
                  value={msg}
                  onChange={(e) => {
                    setMsg(e.target.value);
                  }}
                  onKeyPress={(e) => {
                    if (e.key === "Enter") {
                      sendMessage();
                      setMsg("");
                    }
                  }}
                />
              </Card>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default Chats;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      session,
    },
  };
}
