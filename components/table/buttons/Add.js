import {
  Button, LoadingOverlay, Modal
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check } from "tabler-icons-react";
import FormModal from "../modals/ResidentModal";


const Add = ({schema, title, endpoint, initialValues}) => {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);
  
  
  const form = useForm({
    schema: zodResolver(schema),
    initialValues: initialValues,
  });

const handleSubmit = async (values, setOpened, setVisible) => {
  setVisible((v) => !v);
  const result = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(values),
  }).then((response) => response.json());

  //If result message is success, then show notification
  if (result.message.acknowledged === true) {
    showNotification({
      title: `Added ${title}`,
      message: "Added Successfully",
      icon: <Check />,
      color: "teal",
    });
    setOpened(false);
    setVisible(false);
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
    <>
      <Button onClick={() => setOpened(true)} variant="light">
        Add Records
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title= {`Add ${title} Records`}
        centered
        size="lg"
      >
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={visible} />

          {
             <form
             onSubmit={form.onSubmit(
               async (values) => await handleSubmit(values, setOpened, setVisible)
             )}
           >
             <FormModal form={form} />
           </form>
          }
        </div>
      </Modal>
    </>
  );
};

export default Add;
