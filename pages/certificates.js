
import { Card, Grid, Group, Text, Title } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import FormModal from "../components/table/modals/ResidentModal";

import Layout from "../components/Layout";
import Add from "../components/table/buttons/Add";
import Delete from "../components/table/buttons/Delete";
import Edit from "../components/table/buttons/Edit";
import ReactTable from "../components/table/ReactTable";

import ResidentModal from "../components/table/modals/ResidentModal";

const ResidentRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    firstname: z.string().min(1, { message: "Name could not be empty" }),
    middlename: z.string().default("test"),
    lastname: z.string().min(1, { message: "Lastname could not be empty" }),
    address: z.string().min(1, { message: "Address could not be empty" }),
    birthdate: z.date(),
    gender: z.enum(["male", "female"]),
    residencyDate: z.date(),
  });

  const initialValues = {
    firstname: "",
    middlename: "",
    lastname: "",
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
        props.row.original.birthdate = new Date(props.row.original.birthdate);
        props.row.original.residencyDate = new Date(
          props.row.original.residencyDate
        );
        return (
          <Edit
            data={props.row.original}
            schema={schema}
            title="Certificate"
            endpoint="/api/resident/updateResident"
            child={<ResidentModal />}
          />
        );
      },
    },
  ];

  const { data: session } = useSession();
  const { data, error } = useSWR("/api/certificate/getCertificates", fetcher, {
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
                <Title mb={6}>Certificate Records</Title>

                <Group>
                  <Add
                    title="Certificate" 
                    endpoint="/api/certificate/addCertificate"       
                    child={ <FormModal form={form} />}
                    form={form}
                  />
                  <Delete
                    selectedID={selectedID}
                    title="Certificate"
                    endpoint="/api/certificate/deleteCertificate"
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
  return {
    props: {
      session,
    },
  };
}

