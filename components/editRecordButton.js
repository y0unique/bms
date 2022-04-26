import { Button, Modal, Grid, Group, TextInput, NumberInput, Select } from "@mantine/core";
import  { useState } from "react";
import { useForm } from '@mantine/form';
import { showNotification } from '@mantine/notifications';
import { DatePicker } from '@mantine/dates';
import { Check } from "tabler-icons-react";

const EditRecordButton = ({id})  => {
    const [opened, setOpened] = useState(false);
  

    
      const form = useForm({
        initialValues: {
            firstname: "",
            middlename:  "",
            lastname:"",
            address:  "",
            age:  "",
            gender:  "",
            residencyDate:  "",
        },
    });


    return ( 
        <><Button variant="outline" radius="xl" onClick={ async() => {
            setOpened(true);
            const result = await fetch('/api/findResident', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({id: id}),
            }).then(response => response.json());
            form.setValues({
                firstname: result.firstname,
                middlename: result.middlename,
                lastname: result.lastname,
                address: result.address,
                birthdate: new Date(result.birthdate),
                gender: result.gender === "Male" ? "male" : "female" ,
                residencyDate: new Date(result.residencyDate)
            })
            }}>Edit</Button>
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title="Edit Resident Record"
            centered
            size="lg"
        >
            {<form onSubmit={form.onSubmit(async (values) => {
                    const result = await fetch('/api/updateResident', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            id: id,
                            ...values,
                        }),
                    }).then(response => response.json());

                    //If result message is success, then show notification
                    if (result.acknowledged === true) {
                        showNotification({
                            title: 'Updated Resident',
                            message: 'Updated Data Successfully ',
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
 
export default EditRecordButton;