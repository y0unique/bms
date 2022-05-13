import { Button, Grid, Group, Select, TextInput } from "@mantine/core";
import { DatePicker } from "@mantine/dates";

const ActivitytModal = ({form}) => {
  return (
    <>
      <Grid justify="center" grow>
        <Grid.Col span={4}>
          <TextInput
            label="What?"
            {...form.getInputProps("what")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Where"
            {...form.getInputProps("where")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <TextInput
            label="Why"
            {...form.getInputProps("why")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="How"
            {...form.getInputProps("how")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={6}>
          <TextInput
            label="Who"
            {...form.getInputProps("who")}
          ></TextInput>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            label="When"
            placeholder="Set when"
            {...form.getInputProps("when", { type: "date" })}
          ></DatePicker>
        </Grid.Col>

        <Grid.Col span={4}>
          <DatePicker
            placeholder="Set When"
            label="When"
            {...form.getInputProps("when")}
          />
        </Grid.Col>
      </Grid>
      <Group position="right" mt="md">
        <Button type="submit">Submit</Button>
      </Group>
    </>
    
  );
};

export default ActivitytModal;
