import Head from "next/head";
import { MantineProvider } from "@mantine/core";
import { SessionProvider } from "next-auth/react";
import { useState } from "react";
import { ColorSchemeProvider } from "@mantine/core";
import { useSession } from "next-auth/react";
import { NotificationsProvider } from '@mantine/notifications';
import Fonts from '../components/Fonts';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  const [colorScheme, setColorScheme] = useState("light");
  const toggleColorScheme = (value) =>
    setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
  return (
    <>
      <Head>
        <title> Barangay Management Web App </title>
      </Head>

      <Fonts/>

      <SessionProvider session={session}>
        <NotificationsProvider>
          <ColorSchemeProvider
            colorScheme={colorScheme}
            toggleColorScheme={toggleColorScheme}
          >
            
            <MantineProvider
              theme={{
                // Override any other properties from default theme
                fontFamily: 'sans-serif',
                fontFamilyMonospace: 'Monaco, Courier, monospace',
                headings: { fontFamily: 'Greycliff CF, sans-serif' },
                spacing: { xs: 15, sm: 20, md: 25, lg: 30, xl: 40 },
                colorScheme: colorScheme,

              }}
              withGlobalStyles
            >
              {Component.auth ? (
                <Auth>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </MantineProvider>
          </ColorSchemeProvider>
        </NotificationsProvider>
      </SessionProvider>
    </>
  );
}
function Auth({ children }) {
  const { data: session, status } = useSession({ required: true })
  const isUser = session?.user

  if (isUser) {
    return children
  }

  // Session is being fetched, or no user.
  // If no user, useEffect() will redirect.
  return <div>Loading...</div>
}

export default MyApp;
