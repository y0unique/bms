import {
    Grid,
    Modal,
    NumberInput,
    Select,
    TextInput,
    Group,
    Button,
    useMantineColorScheme,
} from "@mantine/core";
import { DatePicker } from '@mantine/dates';
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { Check } from "tabler-icons-react";
import  { useState } from "react";

const AddRecordButton = () => {
    const { colorScheme } = useMantineColorScheme();
    const [opened, setOpened] = useState(false);
    const form = useForm({
        initialValues: {
            firstname: "",
            middlename: "",
            lastname: "",
            address: "",
            birthdate: "",
            gender: "Male",
            date: "01/01/2022",
        },
    });


    return (
        <><Button onClick={() => setOpened(true) } variant="light">
            Add Records
        </Button>
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Add Resident Records"
            centered
            size="lg"
        >
                {<form onSubmit={form.onSubmit(async (values) => {
                    const result = await fetch('/api/resident/addResident', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(values),
                    }).then(response => response.json());

                    //If result message is success, then show notification
                    if (result.message.acknowledged === true) {
                        showNotification({
                            title: 'Added Resident',
                            message: 'Added Successfully ',
                            icon: <Check />,
                            color: "teal",
                        });
                        setOpened(false);
                    } else {
                        showNotification({
                            title: 'Error',
                            message: result.message,
                            icon: <Check />,
                            color: colorScheme === "light" ? "red" : "dark",
                        });
                    }

                })}>
                    <Grid justify="center" grow>
                        <Grid.Col span={4}>
                            <TextInput
                                label="First Name"
                                {...form.getInputProps('firstname')}>
                            </TextInput>
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput
                                label="Middle Name"
                                {...form.getInputProps('middlename')}>
                            </TextInput>
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <TextInput
                                label="Last Name"
                                {...form.getInputProps('lastname')}>
                            </TextInput>
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <TextInput
                                label="Address"
                                {...form.getInputProps('address')}>
                            </TextInput>
                        </Grid.Col>

                        <Grid.Col span={6}>
                            <Select
                                label="Gender"
                                data={[
                                    { value: "male", label: "Male" },
                                    { value: "female", label: "Female" }
                                ]}
                                {...form.getInputProps('gender')}>
                            </Select>
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <DatePicker
                                label="Birthdate"
                                placeholder="Set Birthdate"
                                {...form.getInputProps('birthdate')}>
                            </DatePicker>
                        </Grid.Col>

                        <Grid.Col span={4}>
                            <DatePicker placeholder="Set Date" label="Residency Date"
                                {...form.getInputProps('residencyDate')} />
                        </Grid.Col>



                    </Grid>
                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>}
            </Modal></>
    );
}

export default AddRecordButton;