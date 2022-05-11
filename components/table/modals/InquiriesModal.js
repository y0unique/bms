import { Button, Grid, Group, Select, SelectChevronIcon, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const InquiriesModal = ({form}) => {
  return (
    <>
      <Grid justify="center" grow>
        
        <Grid.Col span={5}>
          <Select
            label="Purpose"
            data={[
              { value: "Certificate", label: "Certificate" },
              { value: "Blotter", label: "Blotter" },
            ]}
            {...form.getInputProps("purpose")}
          ></Select>
        </Grid.Col>

        <Grid.Col span={5}>
          <Select
            label="Status"
            data={[
              { value: "pending", label: "pending" },
              { value: "active", label: "active" },
            ]}
            {...form.getInputProps("status")}
          ></Select>
        </Grid.Col>

        <Grid.Col span={6}>
          <Select
            label="Type"
            data={[
              { value: "Blotter", label: "Blotter" },
              { value: "Barangay Certificate", label: "Barangay Certificate" },
              { value: "Certificate of Indigency", label: "Certificate of Indigency" },
              { value: "Barangay ID", label: "Barangay ID" },
            ]}
            {...form.getInputProps("type")}
          ></Select>
        </Grid.Col>
        
        <Grid.Col span={12}>
          <TextInput
            label="Report"
            {...form.getInputProps("report")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
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