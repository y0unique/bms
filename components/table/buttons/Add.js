import {
  ActionIcon,
  Button,
  Group,
  LoadingOverlay,
  Modal,
  Text,
} from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { useState } from "react";
import { Check, CirclePlus } from "tabler-icons-react";

const Add = ({ title, endpoint, form, child }) => {
  const [opened, setOpened] = useState(false);
  const [visible, setVisible] = useState(false);

  const handleSubmit = async (values, setOpened, setVisible, child) => {
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
  };

  return (
    <>
      <Button
        onClick={() => setOpened(true)}
        leftIcon={<CirclePlus />}
        radius="xl"
        variant="light"
      >
      Add {title}
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Add ${title} Records`}
        centered
        size="lg"
      >
        <div style={{ position: "relative" }}>
          <LoadingOverlay visible={visible} />

          {
            <form
              onSubmit={form.onSubmit(
                async (values) =>
                  await handleSubmit(values, setOpened, setVisible)
              )}
            >
              {child}
            </form>
          }
        </div>
      </Modal>
    </>
  );
};

export default Add;
