import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const InquiriesModal = ({form}) => {
  return (
    <>
      <Grid justify="center" grow>
        <Grid.Col span={5}>
          <TextInput
            label="Purpose"
            {...form.getInputProps("purpose")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={5}>
          <TextInput
            label="Status"
            {...form.getInputProps("status")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Type"
            data={[
              { value: "Barangay Certificate", label: "Barangay Certificate" },
              { value: "Certificate of Indigency", label: "Certificate of Indigency" },
            ]}
            {...form.getInputProps("type")}
          ></Select>
        </Grid.Col>
        
        <Grid.Col span={6}>
          <Select
            label="Report"
            data={[
              { value: "Barangay Certificate", label: "Barangay Certificate" },
              { value: "Certificate of Indigency", label: "Certificate of Indigency" },
            ]}
            {...form.getInputProps("report")}
          ></Select>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            label="Inquired Date"
            placeholder="Set Inquired Date"
            {...form.getInputProps("dateInquired", { type: "date" })}
          ></DatePicker>
        </Grid.Col>

      </Grid>
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </>
    
  );
};

export default InquiriesModal;