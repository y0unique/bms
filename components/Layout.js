import { HeaderAction } from "./Header";
import { Sidebar } from "./Sidebar";
import {
    AppShell,
    Navbar,
    Header,
    Text,
    Grid,
    Title,
    Card,
    Divider,
    
  } from "@mantine/core";
  import { useBooleanToggle } from "@mantine/hooks";
  
const Layout = ({children}) => {
  const [opened, toggleOpened] = useBooleanToggle(true);
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
            width={{  md: 300 }}
            height={600}
          >
            {<Sidebar />}
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
                transition: "padding-left 1000ms ease"
          },
        })}
      >
       {children}
      </AppShell>
     );
}
 
export default Layout;