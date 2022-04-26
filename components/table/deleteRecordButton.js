import { useState } from "react";
import { Button, Divider, Group, Modal, Text } from "@mantine/core";
import differenceBy from 'lodash/differenceBy';
import { showNotification } from '@mantine/notifications';
import {  Check } from "tabler-icons-react";

const DeleteRecordButton = ( {selectedRows , toggleCleared, setToggleCleared, data, setData}) => {
    const [opened, setOpened] = useState(false);
    
    const handleDelete = async () => {

        // Put all ids in an array
        const ids = selectedRows.map(row => row._id);
    
        const result = await fetch('/api/resident/deleteResident', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ _id: ids }),
        }).then(response => response.json());
        console.log(result);
         //If result message is success, then show notification
         if (result.message.acknowledged === true) {
            showNotification({
                title: 'Deleted Resident',
                message: 'Deleted Successfully ',
                icon: <Check />,
                color: "teal",
            })
            setOpened(false);
        } else {
            showNotification({
                title: 'Error',
                message: 'Something went wrong',
                icon: <Check />,
                color: "red",
            })
        }
        setToggleCleared(!toggleCleared);
        setData(differenceBy(data, selectedRows, '_id'));
      };

    return (
        <><Button onClick={() => setOpened(true)} variant="light" color="red">
            Delete
        </Button>
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Delete Resident"
            centered
            size="xs"
        >
           
            <Text>Are you sure you want to delete the selected resident?</Text>
            <Divider />
            <Group mt={12}>
                <Button onClick={handleDelete} variant="light" color="red">
                    Yes
                </Button>
                <Button onClick={() => setOpened(false)} variant="light">
                    No
                </Button>
            </Group>
            
            </Modal></>
    );
}

export default DeleteRecordButton;