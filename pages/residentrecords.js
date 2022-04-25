import Layout from "../components/Layout";
import {
  Card,
  Avatar,
  Button,
  Group,
  Grid,
  Text,
  Title,
  TextInput,
} from "@mantine/core";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { TableResident } from "../components/TableResident";
import { useState } from "react";


const columns = [
  {
    name: <Text> Picture </Text>,
    cell: (row) => <Avatar size={26} src={row.avatar} radius={26} />,
  },
  {
    name: <Text> Name </Text>,
    cell: (row) => row.firstname + " " + row.middlename + " " + row.lastname,
  },
  {
    name: <Text> Age </Text>,
    cell: (row) => row.age,
  },
  {
    name: <Text> Gender </Text>,
    cell: (row) => row.gender,
  },
  {
    name: <Text> Address </Text>,
    cell: (row) => row.address,
  },
  {
    name: <Text> Residency Date </Text>,
    cell: (row) => row.residencyDate,
  },
];


const ResidentRecords = ({ data }) => {
  const { data: session } = useSession();
  const [resident, setResident] = useState(data);
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
               
                 <TableResident
                  data={resident}    
                  setData={setResident} 
                  columns={columns}
                /> 
             
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
  // fetch data from getResidents.js
  const response = await fetch("http://localhost:3000/api/getResidents", {
      headers: {
        cookie: context.req.headers.cookie || "",
      },
    });
    const data = await response.json();
    console.log(data);
  return {
    props: { data }, // will be passed to the page component as props
  };
}
