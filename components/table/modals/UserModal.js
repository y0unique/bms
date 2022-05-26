import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const UserModal = ({form}) => {
  return (
    <>
      <Grid justify="center" grow>
        <Grid.Col span={4}>
          <TextInput
            label="Username"
            {...form.getInputProps("username")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Password"
            {...form.getInputProps("password")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={12}>
          <Select
            label="User Roles"
            data={[
              { value: "admin", label: "Admin" },
              { value: "user", label: "User" },
            ]}
            {...form.getInputProps("roles")}
          ></Select>
        </Grid.Col>
        
      </Grid>
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </>
    
  );
};

export default UserModal;
