import { AppShell, Header, Navbar } from "@mantine/core";
import { useBooleanToggle } from "@mantine/hooks";
import { HeaderAction } from "./Header";
import {  useSession } from "next-auth/react";
import { Sidebar } from "./Sidebar";
import { SidebarUser } from "./SidebarUser";

const Layout = ({ children }) => {
  const [opened, toggleOpened] = useBooleanToggle(true);
  const { data: session } = useSession();
  
  return (
    <AppShell
      fixed={true}
      padding="md"
      navbar={
        <Navbar
          sx={{
            overflow: "hidden",
            transition: "width 800ms ease, min-width 1000ms ease",
          }}
          hidden={opened}
          width={{ md: 300 }}
          height={"90%"}
        >
          {session.user.user.roles && session.user.user.roles.includes("admin") && (
            <Sidebar />
          )}
          {session.user.user.roles && session.user.user.roles.includes("user") && (
            <SidebarUser />
          )}
        </Navbar>
      }
      navbarOffsetBreakpoint="sm"
      header={
        <Header height={70}>
          {<HeaderAction opened={opened} toggleOpened={toggleOpened} />}
        </Header>
      }
      styles={(theme) => ({
        main: {
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
          transition: "padding-left 1000ms ease",
        },
      })}
    >
      {children}
    </AppShell>
  );
};

export default Layout;
