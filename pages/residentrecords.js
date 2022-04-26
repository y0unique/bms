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
import { useSession, getSession } from "next-auth/react";
import { useState, useEffect } from "react";
import useSWR from 'swr'
import { TableResident } from "../components/TableResident";
import EditRecordButton from "../components/editRecordButton";
import AddRecordButton from "../components/addRecordButton";
import moment from "moment";

const columns = [
  {
    name: <Text> Name </Text>,
    cell: (row) => row.firstname + " " + row.middlename + " " + row.lastname,
  },
  {
    name: <Text> Age </Text>,
    cell: (row) =>{ 
      const now = moment();
      const birth = moment(row.birthdate);
      const diff =  now.diff(birth, 'years');
      return diff;
  },
    // cell: (row) => moment(row.birthdate).format('YYYY-MM-DD'),
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
    cell: (row) => moment(row.residencyDate).format('MM-DD-YYYY'),
  },
  {
    name: <Text> Action </Text>,
    cell: (row) => <EditRecordButton id={row._id}>Edit</EditRecordButton>,
  },
];

const fetcher = (url) => fetch(url).then((r) => r.json());

const ResidentRecords = () => {
  // const fetcher = async () => {
  //   const response = await fetch("/api/getResidents")
  //   const data = await response.json();
  //   return data;
  // }
  // const { res, error } = useSWR('/api/getResidents', fetcher)

  const { data: session } = useSession();
  // const [resident, setResident] = useState(data);
  
  // useEffect(() => {
  //   setResident(res);
  // }, [res])
 
  const { data } = useSWR('/api/getResidents', apiURL => fetch(apiURL).then(res => res.json()));
  const [resident, setResident] = useState(data);
  
  useEffect(() => {
    setResident(data);
  }, [data])
  
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
                <AddRecordButton />
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
  const session = await getSession(context)
  if (!session) {
    return {
      redirect: {
        destination: '/auth/login',
        permanent: false,
      },
    }
  }

  // fetch data from getResidents.js
  const response = await fetch('http://localhost:3000/api/getResidents', {
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
