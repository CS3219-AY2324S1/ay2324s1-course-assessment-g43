import { useState } from "react";
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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { PageContainer } from "../components/PageContainer";

export const LoginUser = () => {
  const [showPassword, setShowPassword] = useState(false);

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
            <Input type="email" />
          </FormControl>
          <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <InputGroup>
              <Input type={showPassword ? "text" : "password"} />
              <InputRightElement h={"full"}>
                <Button
                  variant={"ghost"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? <ViewIcon /> : <ViewOffIcon />}
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
};
