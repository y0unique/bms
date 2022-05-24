import { Card, Grid, Group, Text, Title, Button } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import useSWR from "swr";
import moment from "moment";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { saveAs } from 'file-saver';

import Layout from "../../components/Layout";
import Add from "../../components/table/buttons/Add";
import Delete from "../../components/table/buttons/Delete";
import Edit from "../../components/table/buttons/Edit";
import ReactTable from "../../components/table/ReactTable";

import CertificateModal from "../../components/table/modals/CertificateModal";

const CertificateRecords = () => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");

  const schema = z.object({
    type: z.string().min(1, { message: "Could not be empty" }),
    dateSubmitted: z.date(),
  });

  const initialValues = {
    type: "",
    dateSubmitted: "",
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
      Header: "Type",
      accessor: "type",
    },
    {
      Header: "Submitted Date",
      accessor: "dateSubmitted",
      Cell: (props) => {
        return moment(props.row.original.dateSubmitted).format("MM-DD-YYYY");
      },
    },
    {
      Header: "Action",
      accessor: "action",
      Cell: (props) => {
        // Convert strings to dates to render in modal
        props.row.original.dateSubmitted = new Date(
          props.row.original.dateSubmitted
        );
        props.row.original.dateSubmitted = new Date(
          props.row.original.dateSubmitted
        );
        return (
          <>
          <Group>
            <Edit
              data={props.row.original}
              schema={schema}
              title="Certificate"
              endpoint="/api/certificate/updateCertificate"
              child={<CertificateModal form={form} />}
            />
            <Button variant="outline" radius="xl" color="green" onClick={() => {
              console.log(props.row.original)
              fetch("/api/certificate/generatePDF", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(props.row.original),
              })
                .then((res) => res.json())
                .then(  (data) => {
                 console.log(data);
                   fetch(data.url)
                  .then(res => res.blob())
                  .then((blob) => {
                      saveAs(blob, 'CERTIFICATE.pdf');
                  })

                });
            }} >Download</Button>
          </Group>
          </>
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
                  {/* <Add
                    title="Certificate"
                    schema={schema}
                    form={form}
                    endpoint="/api/certificate/addCertificate"
                    initialValues={initialValues}
                    child={<CertificateModal form={form}/>}
                  /> */}
                
                </Group>

                <ReactTable
                  data={data}
                  cols={columns}
                  schema={schema}
                  setSelectedID={setSelectedID}
                  deleteButton = {
                    <Delete
                    selectedID={selectedID}
                    title="Certificate"
                    endpoint="/api/certificate/deleteCertificate"
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

export default CertificateRecords;

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
