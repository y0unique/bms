
import Layout from "../components/Layout";
import { Card, Modal, Button, Group, Grid, Text, Title } from "@mantine/core";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TableResident } from "../components/TableResident";
import { useState } from 'react';


const ResidentRecords = ({ residentData }) => {
  const [opened, setOpened] = useState(false);
  const { data: session } = useSession();

  const [selection, setSelection] = useState(["1"]);
  const [residents, setResidents] = useState(residentData);
  const remove = (id) => {
    console.log(id);
    //loop through the id 
    id.forEach(element => {
      //find the index of the id
      const index = residents.findIndex(resident => resident.id === element);
      //remove the index
      residents.splice(index, 1);
      //TODO: send delete request to server
      // update the resident data
      setResidents([...residents]);
      setSelection([]);
    });

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
                <Title mb={6}>Resident Records</Title>
                <Group position="right" mb={10}>
                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Add Resident Records"
                    centered
                  >
                    {/* Modal content */}
                  </Modal>

                  <Button onClick={() => setOpened(true)} variant="light">Add Records</Button>
                  <Button onClick={() =>remove(selection)} variant="light" color="red">Delete</Button>
                </Group>
                <TableResident residents={residents} selection={selection} setSelection={setSelection} />
              </Card>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default ResidentRecords;

export async function getServerSideProps(context) {
  const residentData = [
    {
      id: "1",
      avatar:
        "https://images.unsplash.com/photo-1624298357597-fd92dfbec01d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Robert Wolfkisser",
      job: "Engineer",
      email: "rob_wolf@gmail.com",
    },
    {
      id: "2",
      avatar:
        "https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Jill Jailbreaker",
      job: "Engineer",
      email: "jj@breaker.com",
    },
    {
      id: "3",
      avatar:
        "https://images.unsplash.com/photo-1632922267756-9b71242b1592?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Henry Silkeater",
      job: "Designer",
      email: "henry@silkeater.io",
    },
    {
      id: "4",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Bill Horsefighter",
      job: "Designer",
      email: "bhorsefighter@gmail.com",
    },
    {
      id: "5",
      avatar:
        "https://images.unsplash.com/photo-1630841539293-bd20634c5d72?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=250&q=80",
      name: "Jeremy Footviewer",
      job: "Manager",
      email: "jeremy@foot.dev",
    },
  ];

  return {
    props: { residentData }, // will be passed to the page component as props
  };
}
