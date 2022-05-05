import React from "react";
import {
  createStyles,
  Menu,
  Center,
  Header,
  Container,
  Group,
  Button,
  Burger,
} from "@mantine/core";
import { ChevronDown, Golf } from "tabler-icons-react";
import Link from "next/link";
import { ThemeToggle } from "./ThemeToggle";

const links = [
  // {
  //   link: "/",
  //   label: "Home",
  // },
  // {
  //   "link": "#1",
  //   "label": "Learn",
  //   "links": [
  //     {
  //       "link": "/docs",
  //       "label": "Documentation"
  //     },
  //     {
  //       "link": "/resources",
  //       "label": "Resources"
  //     },
  //     {
  //       "link": "/community",
  //       "label": "Community"
  //     },
  //     {
  //       "link": "/blog",
  //       "label": "Blog"
  //     }
  //   ]
  // },
  // {
  //   link: "/about",
  //   label: "About",
  // },
  // {
  //   link: "/announcement",
  //   label: "Announcement",
  // },
  // {
  //   link: "/Chats",
  //   label: "Chat",
  // },
];
const HEADER_HEIGHT = 60;

const useStyles = createStyles((theme) => ({
  inner: {
    height: HEADER_HEIGHT,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  links: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },

  burger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },

  link: {
    display: "block",
    lineHeight: 1,
    padding: "8px 12px",
    borderRadius: theme.radius.sm,
    textDecoration: "none",
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.colors.gray[7],
    fontSize: theme.fontSizes.sm,
    fontWeight: 500,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[6]
          : theme.colors.gray[0],
    },
  },

  linkLabel: {
    marginRight: 5,
  },
}));

export function HeaderAction({ opened, toggleOpened }) {
  const { classes } = useStyles();

  const items = links.map((link) => {
    const menuItems = link.links?.map((item) => (
      <Menu.Item key={item.link}>{item.label}</Menu.Item>
    ));

    if (menuItems) {
      return (
        <Menu
          key={link.label}
          trigger="hover"
          delay={0}
          transitionDuration={0}
          placement="end"
          gutter={1}
          control={
            <a
              href={link.link}
              className={classes.link}
              onClick={(event) => event.preventDefault()}
            >
              <Center>
                <span className={classes.linkLabel}>{link.label}</span>
                <ChevronDown size={12} />
              </Center>
            </a>
          }
        >
          {menuItems}
        </Menu>
      );
    }

    return (
      <Link href={link.link} key={link.label}>
        <a
          key={link.label}
          className={classes.link}
          //onClick={(event) => event.preventDefault()}
        >
          {link.label}
        </a>
      </Link>
    );
  });

  return (
    <Container className={classes.inner} fluid>
      <Group>
        <Burger
          opened={opened}
          onClick={() => toggleOpened()}
          className={classes.burger}
          size="sm"
        />
      </Group>
      <Group spacing={5} className={classes.links}>
        {items}
      </Group>

      <Group spacing={15}>
      <ThemeToggle />
      </Group>
    </Container>
  );
}
