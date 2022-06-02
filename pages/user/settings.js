import { Card, Grid, Group, Text, Title, ActionIcon } from "@mantine/core";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";
import { Settings, Check } from "tabler-icons-react";
import { showNotification } from "@mantine/notifications";

import Layout from "../../components/Layout";
import Edit from "../../components/table/buttons/Edit";

import { findResident } from "../api/resident/findResident";

import ResidentModal from "../../components/table/modals/ResidentModal";

const Setting = ({resident}) => {
  const fetcher = (url) => fetch(url).then((res) => res.json());
  const [selectedID, setSelectedID] = useState("");


  const schema = z.object({
    firstname: z.string().min(1, { message: "Name could not be empty" }),
    middlename: z.string().default("test"),
    lastname: z.string().min(1, { message: "Lastname could not be empty" }),
    email: z.string().min(1, { message: "Email could not be empty" }),
    contactNum: z
      .string()
      .min(1, { message: "Contact Number could not be empty" }),
    residentialType: z.enum(["Permanent", "Rental"]),
    address: z.string().min(1, { message: "Address could not be empty" }),
    birthdate: z.date(),
    gender: z.enum(["Male", "Female"]),
    residencyDate: z.date(),
  });

  const initialValues = {
    firstname: resident.firstname,
    middlename: resident.middlename,
    lastname: resident.lastname,
    email: resident.email,
    contactNum: resident.contactNum,
    residentialType: resident.residentialType,
    address: resident.address,
    birthdate: new Date(resident.birthdate),
    gender: resident.gender,
    residencyDate: new Date(resident.residencyDate),
    email: resident.email,
    contactNum: resident.contactNum
  };

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: initialValues,
  });



  const { data: session } = useSession();

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
      {session && resident && (
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
              <form onSubmit={form.onSubmit(async (values) => 
                {
                    values.id = resident._id
                    const response = await fetch(`/api/resident/updateResident`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify(values),
                    });
                    const data = await response.json();
                    if (data.acknowledged === true) {
                        showNotification({
                          title: `Updated ${resident.firstname} ${resident.lastname}`,
                          message: "Record Updated Successfully",
                          icon: <Check />,
                          color: "teal",
                        });
                      } else {
                        showNotification({
                          title: "Error",
                          message: result.message,
                          icon: <Check />,
                          color: colorScheme === "light" ? "red" : "dark",
                        });
                      }
                      window.location.reload();
                })}>
                <ResidentModal
                  form={form}
                  schema={schema}
                  initialValues={initialValues}
                  disabled={true}
                />
                </form>
              </Card>
            </Grid.Col>
          </Grid>
        </>
      )}
    </Layout>
  );
};

export default Setting;

export async function getServerSideProps(context) {
  const session = await getSession(context);
  const res = await findResident(session.user.user.resident);
  const resident = JSON.parse(JSON.stringify(res))

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
      resident
    },
  };
}
