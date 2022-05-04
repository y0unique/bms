
import { Button, Modal } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check } from "tabler-icons-react";
import React from "react";

const Edit = ({ data, title, endpoint, schema, child}) => {
  const [opened, setOpened] = useState(false);
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: data,
  });
  
  async function handleSubmit(values, setOpened) {
    console.log(values);
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: values._id,
        ...values,
      }),
    }).then((response) => response.json());
  
    //If result message is success, then show notification
    if (result.acknowledged === true) {
      showNotification({
        title: `Updated ${title}`,
        message: "Updated Successfully ",
        icon: <Check />,
        color: "teal",
      });
      setOpened(false);
    } else {
      showNotification({
        title: "Error",
        message: result.message,
        icon: <Check />,
        color: colorScheme === "light" ? "red" : "dark",
      });
    }
  }

  return (
    <><Button
      variant="outline"
      radius="xl"
      onClick={() => {
        setOpened(true);
      } }
    >
      Edit
    </Button>
    <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Edit ${title} Record`}
        centered
        size="lg"
      >

     
    <form
      onSubmit={form.onSubmit(
        async (values) => await handleSubmit(values, setOpened)
      )}
    >
      {React.cloneElement(child, { form: form })}
      </form>
      </Modal>
      </>
    
  );
};

export default Edit;
