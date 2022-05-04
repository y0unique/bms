import { Card, Grid, Group, Text, Title } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";

import Layout from "../components/Layout";
import Add from "../components/table/buttons/Add";
import Delete from "../components/table/buttons/Delete";
import Edit from "../components/table/buttons/Edit";
import ReactTable from "../components/table/ReactTable";

import InquiriesModal from "../components/table/modals/InquiriesModal";

const InquiriesRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    purpose: z.string().min(1, { message: "Purpose could not be empty" }),
    report: z.string().min(1, { message: "Report could not be empty" }),
    status: z.string().min(1, { message: "Status could not be empty" }),
    type: z.enum(["Barangay Certificate", "Certificate of Indigency"]),
    dateInquired: z.date(),
  });

  const initialValues = {
    purpose: "",
    report: "",
    status: "",
    type: "",
    dateInquired: "",
  };

  const columns = [
    {
      Header: "Type",
      accessor: "type",
      Cell: (props) => {
        return `${props.row.original.type}`;
      },
    },
    {
      Header: "Date Submitted",
      accessor: "dateSubmitted",
      Cell: (props) => {   
        return new Date(props.row.original.dateSubmitted).toLocaleDateString();
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        // Convert strings to dates to render in modal
        props.row.original.dateInquired = new Date(props.row.original.dateInquired);
        props.row.original.dateInquired = new Date(
          props.row.original.dateInquired
        );
        return (
          <Edit
            data={props.row.original}
            schema={schema}
            title="Inquiries"
            endpoint="/api/inquiries/updateInquiries"
            child={<InquiriesModal />}
          />
        );
      },
    },
  ];

  const { data: session } = useSession();
  const { data, error } = useSWR("/api/inquiries/getInquiries", fetcher, {
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
                <Title mb={6}>Inquiries Records</Title>

                <Group>
                  <Add
                    title="Inquiries"
                    schema={schema}
                    endpoint="/api/inquiries/addInquiries"
                    initialValues={initialValues}
                  />
                  <Delete
                    selectedID={selectedID}
                    title="Inquiries"
                    endpoint="/api/inquiries/deleteInquiries"
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

export default InquiriesRecords;

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
