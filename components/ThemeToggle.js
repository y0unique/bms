import React from "react";
import { useMantineColorScheme, ActionIcon, Group } from "@mantine/core";
import { Sun, MoonStars } from "tabler-icons-react";



export function ThemeToggle() {
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();

  
  return (
    <Group position="center" my="xl">
      <ActionIcon
        onClick={() => {
          toggleColorScheme();
         
        }}
        size="lg"
        sx={(theme) => ({
          backgroundColor:
            theme.colorScheme === "dark"
              ? theme.colors.dark[6]
              : theme.colors.gray[0],
          color:
            theme.colorScheme === "dark"
              ? theme.colors.yellow[4]
              : theme.colors.blue[6],
          borderRadius: "50%",
        })}
      >
        {colorScheme === "dark" ? <Sun size={18} /> : <MoonStars size={18} />}
      </ActionIcon>
    </Group>
  );
}


