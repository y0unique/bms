import { createStyles, Group, Paper, SimpleGrid, Text } from '@mantine/core';
import React, { useMemo, useState } from 'react';
import {
  GenderFemale,
  GenderMale,
  Users,
  UserCheck
} from 'tabler-icons-react';

const useStyles = createStyles((theme) => ({
 

  value: {
    fontSize: 24,
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: 'flex',
    alignItems: 'center',
  },

  icon: {
    color: theme.colorScheme === 'dark' ? theme.colors.dark[3] : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: 'uppercase',
  },
}));

const icons = {
  users: Users,
  male: GenderMale,
  female: GenderFemale,
  user: UserCheck
};






export default function TotalPopulation() {
  const { classes } = useStyles();

  const [residents, setResident] = useState([]);
  
   useMemo(() => {
    fetch("/api/resident/getResidents")
        .then(res => res.json())
        .then(data => {
            setResident(data);
        }
        );
    }, []);

    //find all residents with Rental and Permanent residentialType
    const totalPermanent = residents.filter(resident => resident.residentialType === "Permanent").length;
    const male =  residents.filter(item => item.gender.match("Male")).length;
    const female  = residents.filter(item => item.gender.match("Female")).length;
    

    const stat = 
    [
          {
            "title": "Total Population",
            "icon": "users",
            "value": residents.length,
          },
          {
            "title": "Male",
            "icon": "male",
            "value": male,
          },
          {
            "title": "Female",
            "icon": "female",
            "value": female,
          },
          {
            "title": "Permanent Residents",
            "icon": "user",
            "value": totalPermanent
          }
        ]
  const stats = stat.map((stat) => {
    const Icon = icons[stat.icon];

    return (
      <Paper withBorder p="lg" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size={22} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
          
        </Group>

      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: 'md', cols: 2 },
          { maxWidth: 'xs', cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>
    </div>
  );
}