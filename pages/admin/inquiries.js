import { Card, Grid, Group, Text, Title, Badge } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";

import Layout from "../../components/Layout";
// import Add from "../../components/table/buttons/Add";
import Delete from "../../components/table/buttons/Delete";
import Edit from "../../components/table/buttons/Edit";
import ReactTable from "../../components/table/ReactTable";

import InquiriesModal from "../../components/table/modals/InquiriesModal";

const InquiriesRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    purpose: z.enum(["Certificate", "Blotter"]),
    report: z.string().min(1, { message: "Report could not be empty" }),
    status: z.enum(["pending", "active"]),
    type: z.enum([
      "Blotter",
      "Barangay Certificate",
      "Certificate of Indigency",
      "Barangay ID",
    ]),
    dateInquired: z.date(),
  });

  const initialValues = {
    purpose: "",
    report: "",
    status: "",
    type: "",
    dateInquired: "",
    resident: "",
  };

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: initialValues,
  });

  const columns = [
    {
      Header: "Name",
      accessor: "resident",
      Cell: (props) => {
        console.log(props.row.original);
        return `${props.row.original?.resident?.firstname} ${props.row.original?.resident?.middlename} ${props.row.original?.resident?.lastname}`;
      },
    },
    {
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Status",
      accessor: "status",
      Cell: (props) => {
        if (props.row.original.status === "active") {
          return <Badge color="green">{props.row.original.status}</Badge>;
        } else if (props.row.original.status === "pending") {
          return <Badge color="yellow">{props.row.original.status}</Badge>;
        } else if (props.row.original.status === "inactive") {
          return <Badge color="red">{props.row.original.status}</Badge>;
        }
        return <Badge>{props.row.original.status}</Badge>;
      },
    },
    {
      Header: "Date Inquired",
      accessor: "dateInquired",
      Cell: (props) => {
        return moment(props.row.original.dateInquired).format("MM-DD-YYYY");
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        // Convert strings to dates to render in modal
        props.row.original.dateInquired = new Date(
          props.row.original.dateInquired
        );
        return (
          <Edit
            data={props.row.original}
            schema={schema}
            title="Inquiry"
            endpoint="/api/inquiries/updateInquiries"
            child={<InquiriesModal form={form} />}
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
                  {/* <Add
                    title="Inquiries"
                    schema={schema}
                    endpoint="/api/inquiries/addInquiries"
                    initialValues={initialValues}
                    form={form}
                    child={<InquiriesModal form={form} />}
                  /> */}
                </Group>

                <ReactTable
                  data={data}
                  cols={columns}
                  schema={schema}
                  setSelectedID={setSelectedID}
                  deleteButton={
                    <Delete
                      selectedID={selectedID}
                      title="Inquiries"
                      endpoint="/api/inquiries/deleteInquiries"
                    />
                  }
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
  if (session.user.user.roles !== "admin") {
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
