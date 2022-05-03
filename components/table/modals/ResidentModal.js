import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const ResidentModal = ({form}) => {
  return (
    <>
      <Grid justify="center" grow>
        <Grid.Col span={4}>
          <TextInput
            label="First Name"
            {...form.getInputProps("firstname")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Middle Name"
            {...form.getInputProps("middlename")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Last Name"
            {...form.getInputProps("lastname")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Address"
            {...form.getInputProps("address")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Gender"
            data={[
              { value: "male", label: "Male" },
              { value: "female", label: "Female" },
            ]}
            {...form.getInputProps("gender")}
          ></Select>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            label="Birthdate"
            placeholder="Set Birthdate"
            {...form.getInputProps("birthdate", { type: "date" })}
          ></DatePicker>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            placeholder="Set Date"
            label="Residency Date"
            {...form.getInputProps("residencyDate")}
          />
        </Grid.Col>
      </Grid>
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </>
    
  );
};

export default ResidentModal;
