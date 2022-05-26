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

import UserModal from "../../components/table/modals/UserModal";

const UserRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    username: z.string().min(1, { message: "Username could not be empty" }),
    password: z.string().min(1, { message: "Password could not be empty" }),
    roles: z.enum(["admin", "user"]),
  });

  const initialValues = {
    username: "",
    password: "",
    roles: "",
  };

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: initialValues,
  });

  const columns = [
    {
      Header: "Username",
      accessor: "username",
    },
    {
      Header: "Password",
      accessor: "password",
    },
    {
      Header: "User Role",
      accessor: "roles",
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
       
        return (
          <Edit
            data={props.row.original}
            schema={schema}
            title="Users"
            endpoint="/api/user/updateUsers"
            child={<UserModal form={form} />}
          />
        );
      },
    },
  ];

  const { data: session } = useSession();
  const { data, error } = useSWR("/api/user/getUsers", fetcher, {
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
                <Title mb={6}>User Records</Title>

                <ReactTable
                  data={data}
                  cols={columns}
                  schema={schema}
                  setSelectedID={setSelectedID}
         
                  addButton={
                    <Add
                      title="Users"
                      schema={schema}
                      form={form}
                      endpoint="/api/user/addUsers"
                      initialValues={initialValues}
                      child={<UserModal form={form} />}
                    />
                  }
                  deleteButton = {
                    <Delete
                    selectedID={selectedID}
                    title="Users"
                    endpoint="/api/user/deleteUsers"
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

export default UserRecords;

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
