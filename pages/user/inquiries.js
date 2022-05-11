import {
  Card,
  Grid,
  Group,
  Text,
  Title,
  Button,
  TextInput,
  Select,
  ActionIcon,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { DatePicker } from "@mantine/dates";
import { getSession, useSession } from "next-auth/react";
import Link from "next/link";
import { useState } from "react";
import { Check, Note, Notes } from "tabler-icons-react";
import { z } from "zod";
import { useForm, zodResolver } from "@mantine/form";

import Layout from "../../components/Layout";

const InquiriesRecords = () => {
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
    resident: "",
  };

  const form = useForm({
    schema: zodResolver(schema),
    initialValues: initialValues,
  });

  const { data: session } = useSession();

  if (!session) return <div>Loading...</div>;

  const handleSubmit = async (values) => {
    const result = await fetch("/api/inquiries/addInquiries", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(values),
    }).then((response) => response.json());

    //If result message is success, then show notification
    if (result.message.acknowledged === true) {
      showNotification({
        title: `Submitted `,
        message: "Submitted Successfully",
        icon: <Check />,
        color: "teal",
      });
    } else {
      showNotification({
        title: "Error",
        message: result.message,
        icon: <Check />,
        color: "red",
      });
    }
  };
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
          <Grid mt={12} justify="center" align="center">
            <Grid.Col span={10}>
              <Group spacing={"10px"}>
                <Title mb={6}>Request Document</Title>
                <ActionIcon>
                  <Notes size={60} strokeWidth={2} />
                </ActionIcon>
              </Group>

              <Text mb={20}>Please fill out the following form</Text>
              <Card>
                <Grid justify="center" grow>
                  <Grid.Col span={5}>
                    <Select
                      label="Purpose"
                      data={[
                        { value: "Certificate", label: "Certificate" },
                        { value: "Blotter", label: "Blotter" },
                      ]}
                      {...form.getInputProps("purpose")}
                    ></Select>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <Select
                      label="Type"
                      data={[
                        { value: "Blotter", label: "Blotter" },
                        {
                          value: "Barangay Certificate",
                          label: "Barangay Certificate",
                        },
                        {
                          value: "Certificate of Indigency",
                          label: "Certificate of Indigency",
                        },
                        { value: "Barangay ID", label: "Barangay ID" },
                      ]}
                      {...form.getInputProps("type")}
                    ></Select>
                  </Grid.Col>

                  <Grid.Col span={12}>
                    <TextInput
                      label="Report"
                      {...form.getInputProps("report")}
                    ></TextInput>
                  </Grid.Col>

                  <Grid.Col span={6}>
                    <DatePicker
                      label="Inquired Date"
                      placeholder="Set Inquired Date"
                      {...form.getInputProps("dateInquired", { type: "date" })}
                    ></DatePicker>
                  </Grid.Col>
                </Grid>
                <Group position="right" mt="md">
                  <Button
                    type="submit"
                    onClick={() => {
                      handleSubmit(form.values);
                    }}
                  >
                    Submit
                  </Button>
                </Group>
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
