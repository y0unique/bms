import { useState } from "react";
import { Button, ActionIcon, Group, Modal, Text } from "@mantine/core";
import { showNotification } from "@mantine/notifications";
import { Check, Trash } from "tabler-icons-react";

const Delete = ({
  selectedID,
  endpoint,
  title,
}) => {
  const [opened, setOpened] = useState(false);

  const handleDelete = async () => {
    // Put all ids in an array
    const ids = selectedID;
    console.log(ids);
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ _id: ids }),
    }).then((response) => response.json());
    console.log(result);
    //If result message is success, then show notification
    if (result.message.acknowledged === true) {
      showNotification({
        title: `Deleted ${title}`,
        message: "Deleted Successfully ",
        icon: <Check />,
        color: "teal",
      });
      setOpened(false);
    } else {
      showNotification({
        title: "Error",
        message: "Something went wrong",
        icon: <Check />,
        color: "red",
      });
    }
   
  };

  return (
    <>
    <Button
        onClick={() => setOpened(true)}
        leftIcon={<Trash />}
        radius="xl"
        color="red"
        variant="light"
      >
      Delete
      </Button>
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={`Delete ${title}`}
        centered
        size="xs"
      >
       
        <p mt={12}>Are you sure you want to delete the selected {title}?</p>
       
        <Group mt={12}>
          <Button onClick={handleDelete} variant="light" color="red">
            Yes
          </Button>
          <Button onClick={() => setOpened(false)} variant="light">
            No
          </Button>
        </Group>
      </Modal>
    </>
  );
};

export default Delete;
