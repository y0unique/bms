import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const BlotterModal = ({form}) => {
  return (
    <>
      <Grid justify="center" grow>
        <Grid.Col span={10}>
          <TextInput
            label="Report"
            {...form.getInputProps("report")}
          ></TextInput>
        </Grid.Col>
        <Grid.Col span={10}>
          <DatePicker
            placeholder="Set Date"
            label="Record Date"
            {...form.getInputProps("dateRecord")}
          />
        </Grid.Col>
      </Grid>
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </>
    
  );
};

export default BlotterModal;
