import {
  TextInput,
  PasswordInput,
  Checkbox,
  Anchor,
  Paper,
  Title,
  Text,
  Container,
  Group,
  Button,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import Link from "next/link";
// Validation
// const schema = Joi.object({
//   username: Joi.string().min(2).message('Username must be at least 2 characters'),
//   password: Joi.string().alphanum().min(8).message('Password must be at least 8 characters and contain letters and numbers'),
// });

export function Form({ handleSubmit, error}) {
  const form = useForm({
    //schema: joiResolver(schema),
    initialValues: {
      username: "",
      password: "",
    },
  });

  return (
    <>
      <Container size={420} mt={40} my={40}>
        <Title
          align="center"
          sx={(theme) => ({
            fontFamily: `Greycliff CF, ${theme.fontFamily}`,
            fontWeight: 900,
          })}
        >
          Login
        </Title>
        <form onSubmit={handleSubmit}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <TextInput
              label="Username"
              name="username"
              placeholder="you@gmail.com"
              required
            />
            <PasswordInput
              label="Password"
              name="password"
              error={error}
              placeholder="Your password"
              required
            />
            <Group position="apart" mt="md">
              <Checkbox label="Remember me" />

              <Anchor size="sm">Forgot password?</Anchor>
            </Group>
            <Button fullWidth mt="xl" type="submit">
              Login
            </Button>
          </Paper>
        </form>
      </Container>
    </>
  );
}
