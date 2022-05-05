import { Card, Grid, Group, Text, Title } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";

import Layout from "../components/Layout";
import Add from "../components/table/buttons/Add";
import Delete from "../components/table/buttons/Delete";
import Edit from "../components/table/buttons/Edit";
import ReactTable from "../components/table/ReactTable";

import BlotterModal from "../components/table/modals/BlotterModal";

const BlotterRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    report: z.string().min(1, { message: "could not be empty" }),
    dateRecord: z.date(),
  });

  const initialValues = {
    report: "",
    dateRecord: "",
  };

    
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: initialValues,
    });
 
  const columns = [
    // {
    //   Header: "Name",
    //   accessor: "firstname",
    //   Cell: (props) => {
    //     return `${props.row.original.firstname} ${props.row.original.middlename}
    //    ${props.row.original.lastname}`;
    //   },
    // },
    // {
    //   Header: "Age",
    //   accessor: "age",
    //   Cell: (props) => {
    //     const now = moment();
    //     const birth = moment(props.row.original.birthdate);
    //     const diff = now.diff(birth, "years");
    //     return diff;
    //   },
    // },
    {
      Header: "Report",
      accessor: "report",
    },
    {
      Header: "Record Date",
      accessor: "dateRecord",
      Cell: (props) => {
        return moment(props.row.original.dateRecord).format("MM-DD-YYYY");
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        // Convert strings to dates to render in modal
        props.row.original.dateRecord = new Date(props.row.original.dateRecord);
        props.row.original.dateRecord = new Date(
          props.row.original.dateRecord
        );
        return (
          <Edit
            data={props.row.original}
            schema={schema}
            title="Blotter"
            endpoint="/api/blotter/updateBlotter"
            child={<BlotterModal form={form}/>}
          />
        );
      },
    },
  ];

  const { data: session } = useSession();
  const { data, error } = useSWR("/api/blotter/getBlotter", fetcher, {
    refreshInterval: 500,
  });

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
                <Title mb={6}>Blotter Records</Title>

                <Group>
                  <Add
                    title="Blotter"
                    schema={schema}
                    form={form}
                    endpoint="/api/blotter/addBlotter"
                    initialValues={initialValues}
                    child={<BlotterModal form={form}/>}
                  />
                  <Delete
                    selectedID={selectedID}
                    title="Blotter"
                    endpoint="/api/blotter/deleteBlotter"
                  />
                </Group>

                <ReactTable
                  data={data}
                  cols={columns}
                  schema={schema}
                  setSelectedID={setSelectedID}
                />
              </Card>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default BlotterRecords;

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
