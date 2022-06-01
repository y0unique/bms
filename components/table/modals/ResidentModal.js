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
            {...form.getInputProps("residentialType")}
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
