import {
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Button,
  Heading,
  Text,
  Link,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { registerUserStore } from "../stores/registerUserStore";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";

export const RegisterUser = observer(() => {
  const state = registerUserStore.state;

  return (
    <PageContainer>
      <Stack spacing={8} w={"100%"} maxW={"lg"} p={6}>
        <Stack w={"100%"} align={"center"}>
          <Heading fontSize={"4xl"}>Register an account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Stack spacing={4} w={"100%"}>
          <FormControl id="username" isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              value={state.username}
              onChange={(e) => registerUserStore.setUsername(e.target.value)}
            />
          </FormControl>
          <FormControl id="email" isRequired>
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={state.email}
              onChange={(e) => registerUserStore.setEmail(e.target.value)}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={state.showPassword ? "text" : "password"}
                value={state.pass}
                onChange={(e) => registerUserStore.setPassword(e.target.value)}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() => registerUserStore.toggleShowPassword()}
                >
                  {state.showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={10} pt={2}>
            <Button
              loadingText="Submitting"
              size="lg"
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={(e) => registerUserStore.register()}
            >
              Register
            </Button>
          </Stack>
          <Stack pt={6}>
            <Text align={"center"}>
              Already a user?{" "}
              <Link color={"blue.400"} href={"/login-user"}>
                Log In
              </Link>
            </Text>
          </Stack>
        </Stack>
      </Stack>
    </PageContainer>
  );
});
