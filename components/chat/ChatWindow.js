import { Card, Title, Stack, Text, Paper, Group, Avatar } from "@mantine/core";

const ChatWindow = () => {
  const message = [
    {
      id: 1,
      name: "John Doe",
      message: "Test message",
    },
    {
      id: 2,
      name: "Jane Doe",
      message: "Test message 2",
    },
  ];

  return (
    <Card>
        <Title mb={6}> Chat Window</Title>
      {message.map((message) => (
        <>
        <Group mt={5} spacing="xs">
          <Avatar
            radius="xl"
            src="https://images.unsplash.com/photo-1518791841217-8f162f1e1131?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80"
          />
            <Text>{message.name}</Text>
            <Text>{message.message}</Text>
            </Group>
        </>
      ))}
     
    </Card>
  );
};

export default ChatWindow;
