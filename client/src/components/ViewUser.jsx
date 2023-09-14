import {
  Button,
  Flex,
  Heading,
  Stack,
  useColorModeValue,
  Text,
  SimpleGrid,
  IconButton,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
// import { viewUserStore } from "../stores/viewUserStore";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";

const ViewUser = observer(() => {
  const navigate = useNavigate();

  // this value should be taken from the store, I am putting a placeholder here first
  const keyValuePairs = [
    // might want to rename this something else
    { key: "Username", value: "John Doe" },
    { key: "Email", value: "abc@email.com" },
  ];

  const redirectToUpdateUserPage = () => {
    navigate("/update-user");
  };

  return (
    <Flex
      minH={"100vh"}
      align={"flex-start"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
      px={6}
      py={12}
    >
      <IconButton
        icon={<ArrowBackIcon />}
        bg={"transparent"}
        onClick={() => {
          navigate(-1);
        }}
      />
      <Stack
        spacing={4}
        w={"full"}
        maxW={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Details
        </Heading>
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
          {keyValuePairs.map((item, index) => (
            <>
              <Text fontWeight="bold">{item.key}:</Text>
              <Text>{item.value}</Text>
            </>
          ))}
        </SimpleGrid>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
          >
            Delete your profile
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={redirectToUpdateUserPage}
          >
            Update your profile
          </Button>
        </Stack>
      </Stack>
    </Flex>
  );
});

export default ViewUser;
