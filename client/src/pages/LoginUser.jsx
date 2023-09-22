import {
  FormControl,
  FormLabel,
  Input,
  Stack,
  Button,
  Heading,
  Text,
  InputGroup,
  InputRightElement,
  Link,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { PageContainer } from "../components/PageContainer";
import { loginUserStore } from "../stores/loginUserStore";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

export const LoginUser = observer(() => {
  const store = loginUserStore;
  const state = store.state;
  const navigate = useNavigate();
  const toast = useToast();

  const onLogin = () => {
    toast.promise(store.login(), {
      success: (user) => {
        if (!!user) navigate("/");
        return {
          title: "Successfully logged in.",
          description:
            "You've successfully logged in! Enjoy our amazing features!",
          duration: 3000,
          isClosable: true,
        };
      },
      error: (error) => ({
        title: "An error occurred.",
        description: error.response.data.message || "Unknown error occurred.",
        duration: 3000,
        isClosable: true,
      }),
      loading: {
        title: "Logging in.",
        description: "Please give us some time to authenticate your account.",
        duration: 3000,
        isClosable: true,
      },
    });
  };

  return (
    <PageContainer>
      <Stack spacing={8} mx={"auto"} maxW={"lg"} py={12} px={6}>
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Log in to your account</Heading>
          <Text fontSize={"lg"} color={"gray.600"}>
            to enjoy all of our cool features ✌️
          </Text>
        </Stack>
        <Stack spacing={4}>
          <FormControl id="email">
            <FormLabel>Email address</FormLabel>
            <Input
              type="email"
              value={state.email}
              onChange={(e) => {
                store.setEmail(e.target.value);
              }}
            />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input
                type={state.showPassword ? "text" : "password"}
                value={state.password}
                onChange={(e) => store.setPassword(e.target.value)}
              />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() => store.toggleShowPassword()}
                >
                  {state.showPassword ? <ViewIcon /> : <ViewOffIcon />}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
          <Stack spacing={10}>
            {/* <Stack
                direction={{ base: "column", sm: "row" }}
                align={"start"}
                justify={"space-between"}
              >
                <Checkbox>Remember me</Checkbox>
                <Text color={"blue.400"}>Forgot password?</Text>
              </Stack> */}
            <Button
              bg={"blue.400"}
              color={"white"}
              _hover={{
                bg: "blue.500",
              }}
              onClick={onLogin}
            >
              Log In
            </Button>
          </Stack>
        </Stack>
        <Stack pt={6}>
          <Text align={"center"}>
            No account yet?{" "}
            <Link color={"blue.400"} href={"/register-user"}>
              Register
            </Link>
          </Text>
        </Stack>
      </Stack>
    </PageContainer>
  );
});
