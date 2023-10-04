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
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { registerUserStore } from "../stores/registerUserStore";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";

export const RegisterUser = observer(() => {
  const state = registerUserStore.state;
  const toast = useToast();

  const onRegister = () => {
    toast.promise(registerUserStore.register(), {
      success: {
        title: "Account registered.",
        description:
          "We've registered an account for you! Log in to use our amazing features!",
        duration: 3000,
        isClosable: true,
      },
      error: (error) => ({
        title: "An error occurred.",
        description: error.response.data.message || "Unknown error occurred.",
        duration: 3000,
        isClosable: true,
      }),
      loading: {
        title: "Registering account.",
        description: "Please give us some time to register your account.",
        duration: 3000,
        isClosable: true,
      },
    });
  };

  return (
    <PageContainer>
      <Stack spacing={8} w={"100%"} maxW={"lg"} p={6}>
        <Stack w={"100%"} align={"center"}>
          <Heading fontSize={"4xl"}>Register an account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <form onSubmit={onRegister}>
          <Stack spacing={4} w={"100%"}>
            <FormControl id="username" isRequired>
              <FormLabel>Username</FormLabel>
              <Input
                placeholder="JohnDoe"
                type="text"
                value={state.username}
                onChange={(e) => registerUserStore.setUsername(e.target.value)}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                placeholder="johndoe@example.com"
                type="email"
                value={state.email}
                onChange={(e) => registerUserStore.setEmail(e.target.value)}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <InputGroup>
                <Input
                  placeholder="johndoe123"
                  type={state.showPassword ? "text" : "password"}
                  value={state.password}
                  onChange={(e) =>
                    registerUserStore.setPassword(e.target.value)
                  }
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
                type="submit"
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
        </form>
      </Stack>
    </PageContainer>
  );
});
