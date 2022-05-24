import { Card, Grid, Group, Text, Title } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";

import Layout from "../../components/Layout";
import Add from "../../components/table/buttons/Add";
import Delete from "../../components/table/buttons/Delete";
import Edit from "../../components/table/buttons/Edit";
import ReactTable from "../../components/table/ReactTable";

import ActivityModal from "../../components/table/modals/ActivityModal";

const ActivityRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    what: z.string().min(1, { message: "could not be empty" }),
    where: z.string().min(1, { message: "could not be empty" }),
    why: z.string().min(1, { message: "could not be empty" }),
    who: z.string().min(1, { message: "could not be empty" }),
    when: z.date(),
  });

  const initialValues = {
    what: "",
    where: "",
    when: "",
    who: "",
    why: "",
    how: "",
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
      Header: "What",
      accessor: "what",
    },
    {
      Header: "Where",
      accessor: "where",
    },
    {
      Header: "Who",
      accessor: "who",
    },
    {
      Header: "How",
      accessor: "how",
    },
    {
      Header: "When",
      accessor: "when",
      Cell: (props) => {
        return moment(props.row.original.when).format("MM-DD-YYYY");
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        // Convert strings to dates to render in modal
        props.row.original.birthdate = new Date(props.row.original.birthdate);
        props.row.original.when = new Date(props.row.original.when);
        return (
          <Edit
            data={props.row.original}
            schema={schema}
            title="Activity"
            endpoint="/api/activity/updateActivity"
            child={<ActivityModal form={form} />}
          />
        );
      },
    },
  ];

  const { data: session } = useSession();
  const { data, error } = useSWR("/api/activity/getActivity", fetcher, {
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
                <Title mb={6}>Activity Records</Title>

                <Group></Group>

                <ReactTable
                  data={data}
                  cols={columns}
                  schema={schema}
                  setSelectedID={setSelectedID}
                  selectedID={selectedID}
                 // TODO: Refactor and copy the same code below (addButton) and pass the component as an object
                  addButton={
                    <Add
                      title="Activity"
                      schema={schema}
                      form={form}
                      endpoint="/api/activity/addActivity"
                      initialValues={initialValues}
                      child={<ActivityModal form={form} />}
                    />
                  }
                  deleteButton = {
                    <Delete
                    selectedID={selectedID}
                    title="Activity"
                    endpoint="/api/activity/deleteActivity" 
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

export default ActivityRecords;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  console.log(session);
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
