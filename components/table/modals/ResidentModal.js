import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const ResidentModal = ({form, disabled}) => {
  return (
    <>
      <Grid justify="center" grow>
        <Grid.Col span={4}>
          <TextInput
            label="First Name"
            disabled = {disabled}
            {...form.getInputProps("firstname")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Middle Name"
            disabled = {disabled}
            {...form.getInputProps("middlename")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Last Name"
            disabled = {disabled}
            {...form.getInputProps("lastname")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Email"

            {...form.getInputProps("email")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Contact Number"
            {...form.getInputProps("contactNum")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={12}>
          <TextInput
            label="Address"
            disabled = {disabled}
            {...form.getInputProps("address")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Gender"
            data={[
              { value: "Male", label: "Male" },
              { value: "Female", label: "Female" },
            ]}
            disabled = {disabled}
            {...form.getInputProps("gender")}
          ></Select>
        </Grid.Col>
        
        <Grid.Col span={6}>
          <Select
            label="Resident Type"
            data={[
              { value: "Permanent", label: "Permanent" },
              { value: "Rental", label: "Rental" },
            ]}
            disabled = {disabled}
            {...form.getInputProps("residentialType")}
          ></Select>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            label="Birthdate"
            placeholder="Set Birthdate"
            disabled = {disabled}
            {...form.getInputProps("birthdate", { type: "date" })}
          ></DatePicker>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            placeholder="Set Date"
            label="Residency Date"
            disabled = {disabled}
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