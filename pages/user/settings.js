import { Card, Grid, Group, Text, Title, ActionIcon } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { Settings} from 'tabler-icons-react';


import Layout from "../../components/Layout";;
import Edit from "../../components/table/buttons/Edit";

import ResidentModal from "../../components/table/modals/ResidentModal";

const ResidentRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    firstname: z.string().min(1, { message: "Name could not be empty" }),
    middlename: z.string().default("test"),
    lastname: z.string().min(1, { message: "Lastname could not be empty" }),
    email: z.string().min(1, { message: "Email could not be empty" }),
    contactNum: z.string().min(1, { message: "Contact Number could not be empty" }),
    residentialType: z.enum(["Permanent", "Rental"]),
    address: z.string().min(1, { message: "Address could not be empty" }),
    birthdate: z.date(),
    gender: z.enum(["Male", "Female"]),
    residencyDate: z.date(),
  });

  const initialValues = {
    firstname: "",
    middlename: "",
    lastname: "",
    email: "",
    contactNum: "",
    residentialType: "",
    address: "",
    birthdate: "",
    gender: "",
    residencyDate: "",
  };

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: initialValues,
  });

  const columns = [
    {
      Header: "Name",
      accessor: "firstname",
      Cell: (props) => {
        return `${props.row.original.firstname} ${props.row.original.middlename}
       ${props.row.original.lastname}`;
      },
    },
    {
      Header: "Age",
      accessor: "age",
      Cell: (props) => {
        const now = moment();
        const birth = moment(props.row.original.birthdate);
        const diff = now.diff(birth, "years");
        return diff;
      },
    },
    {
      Header: "Email",
      accessor: "email",
    },
    {
      Header: "Contact Number",
      accessor: "contactNum",
    },
    {
      Header: "Residential Type",
      accessor: "residentialType",
    },
    {
      Header: "Address",
      accessor: "address",
    },
    {
      Header: "Gender",
      accessor: "gender",
    },
    {
      Header: "Residency Date",
      accessor: "residencyDate",
      Cell: (props) => {
        return moment(props.row.original.residencyDate).format("MM-DD-YYYY");
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        // Convert strings to dates to render in modal
        props.row.original.birthdate = new Date(props.row.original.birthdate);
        props.row.original.residencyDate = new Date(
          props.row.original.residencyDate
        );
        
      },
    },
  ];

  const { data: session } = useSession();
  const { data, error } = useSWR("/api/resident/findResident", fetcher, {
    refreshInterval: 500,
  });
console.log(data);

  if (error) return <div>Failed to load</div>;
  if (!data) return <div>Loading...</div>;

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
      {session && data && (
        <>
          <Grid mt={12}>
            <Grid.Col span={12}>
              <Card>
                <Group spacing={"10px"}>
                    <Title mb={6}>Settings</Title>
                    <ActionIcon>
                    <Settings size={60} strokeWidth={2} />
                    </ActionIcon>
                </Group>
              </Card>
              <Card>
                  <ResidentModal
                      selectedID={session.user.user.resident}
                      setSelectedID={setSelectedID}
                      form={form}
                      schema={schema}
                      initialValues={initialValues}
                      data={data}
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
  const session = await getSession(context);
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login",
        permanent: false,
      },
    };
  }
  if (session.user.user.roles !== "user") {
    return {
      redirect: {
        destination: "/",
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
