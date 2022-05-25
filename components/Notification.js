import { ActionIcon, Group, Popover, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { Album, Bell } from "tabler-icons-react";
import { useEffect } from "react";
import useSWR from 'swr'


const Notification = () => {
  // Clientside data
  const [openNotif, setNotif] = useState(false);
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data: notifications, error } = useSWR('/api/notifications/getNotifs', fetcher)

  if (error) return <div>Failed to load</div>
  if (!notifications) return <div>loading...</div>

  console.log(notifications);
  // Render notification
  const renderNotification = () => {
    return notifications.map((notification, index) => {
      return (
        <div key={index}>
          <Group spacing={1} >
            <ActionIcon mr="md">
              <Album size={48} strokeWidth={2} />
            </ActionIcon>
            <Text size="sm">{notification.description}</Text>
          </Group>
        </div>
      );
    });
  };
 
  return (
    <Popover
      opened={openNotif}
      onClose={() => {
        setNotif(false);

      }}
      target={
        <ActionIcon onClick={() => setNotif((o) => !o)}>
          <Bell />
        </ActionIcon>
      }
      width={400}
      position="bottom"
    >
   
        {!notifications ? (
            <Text size="sm">No notification</Text>
            ) : (
            renderNotification()
            )}
    </Popover>
  );
};


export default Notification;
