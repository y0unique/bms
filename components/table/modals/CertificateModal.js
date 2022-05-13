import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const CertificateModal = ({form}) => {
  return (
    <>
      <Grid justify="center" grow>
        <Grid.Col span={10}>
          <TextInput
            label="Type"
            {...form.getInputProps("type")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            placeholder="Set Date"
            label="Submitted Date"
            {...form.getInputProps("dateSubmitted")}
          />
        </Grid.Col>
      </Grid>
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </>
    
  );
};

export default CertificateModal;
