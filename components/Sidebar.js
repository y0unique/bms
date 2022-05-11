import { Anchor, createStyles, Navbar } from '@mantine/core';
import { signOut } from "next-auth/react";
import Link from 'next/link';
import React, { useState } from 'react';
import {
  Activity, Certificate, Home, Logout, Notes, QuestionMark, Settings, Users,BrandHipchat
} from 'tabler-icons-react';
// import { MantineLogo } from '../../shared/MantineLogo';

const useStyles = createStyles((theme, _params, getRef) => {
  const icon = getRef('icon');
  return {
    header: {
      paddingBottom: theme.spacing.md,
      marginBottom: theme.spacing.md * 1.5,
      borderBottom: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    footer: {
      paddingTop: theme.spacing.md,
      marginTop: theme.spacing.md,
      borderTop: `1px solid ${
        theme.colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[2]
      }`,
    },

    link: {
      ...theme.fn.focusStyles(),
      display: 'flex',
      alignItems: 'center',
      textDecoration: 'none',
      fontSize: theme.fontSizes.sm,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[7],
      padding: `${theme.spacing.xs}px ${theme.spacing.sm}px`,
      borderRadius: theme.radius.sm,
      fontWeight: 500,

      '&:hover': {
        backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.black,

        [`& .${icon}`]: {
          color: theme.colorScheme === 'dark' ? theme.white : theme.black,
        },
      },
    },

    linkIcon: {
      ref: icon,
      color: theme.colorScheme === 'dark' ? theme.colors.dark[2] : theme.colors.gray[6],
      marginRight: theme.spacing.sm,
    },

    linkActive: {
      '&, &:hover': {
        backgroundColor:
          theme.colorScheme === 'dark'
            ? theme.fn.rgba(theme.colors[theme.primaryColor][8], 0.25)
            : theme.colors[theme.primaryColor][0],
        color: theme.colorScheme === 'dark' ? theme.white : theme.colors[theme.primaryColor][7],
        [`& .${icon}`]: {
          color: theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 5 : 7],
        },
      },
    },
  };
});

const data = [
  { link: '/', label: 'Home', icon: Home },
  { link: '/admin/residentrecords', label: 'Residents Records', icon: Users },
  { link: '/admin/blotterrecords', label: 'Blotter Records', icon: Notes },
  { link: '/admin/certificates', label: 'Certificates', icon: Certificate },
  { link: '/admin/activity', label: 'Activity', icon: Activity },
  { link: '/admin/inquiries', label: 'Inquiries', icon: QuestionMark },
  { link: '/user/chats', label: 'Chats', icon: BrandHipchat },
];

export function Sidebar() {
  const { classes, cx } = useStyles();
  const [active, setActive] = useState('');

  const links = data.map((item) => (
    <Link href={item.link}>
    <Anchor
      className={cx(classes.link, { [classes.linkActive]: item.label === active })}
      component="a"
      key={item.label}
      underline={false}
      onClick={(event) => {
        //event.preventDefault();
        setActive(item.label);
      }}
    >
      <item.icon className={classes.linkIcon} />
      <span>{item.label}</span>
    </Anchor>
    </Link>
  ));

  return (
    <>
    
      <Navbar.Section grow>
       
        {links}
      </Navbar.Section>

      <Navbar.Section className={classes.footer}>
        <a href="#" className={classes.link} onClick={(event) => event.preventDefault()}>
          <Settings className={classes.linkIcon} />
          <span>Settings</span>
        </a>

        <a href="#" className={classes.link} onClick={(event) => {
          event.preventDefault(); 
           signOut({ callbackUrl: "/auth/login" })
           }}>
          <Logout className={classes.linkIcon} />
          <span>Logout</span>
        </a>
      </Navbar.Section>
      </>
  );
}