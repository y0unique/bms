import { Card, Grid, Group, Stack, Text, Title } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";

import Layout from "../../components/Layout";
import { ChatWindow, UserList } from "../../components/chat";
const Chats = () => {
  const { data: session } = useSession();

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
            <Grid.Col span={3}>
              <UserList />
            </Grid.Col>
            <Grid.Col span={9}>
              <ChatWindow />
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
