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
import { viewUserStore } from "../stores/viewUserStore";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { deleteUser } from "../services/userService";

const ViewUser = observer(() => {
  const navigate = useNavigate();

  const state = viewUserStore.state;

  const redirectToUpdateUserPage = () => {
    navigate("/update-user");
  };

  const deleteUser = async (e) => {
    e.preventDefault();
    await viewUserStore.deleteUser("1");
  };

  useEffect(async () => {
    await viewUserStore.getInitialState("1");
  }, []);

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
          {Object.entries(state).map((item, index) => (
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
            onClick={async (e) => await deleteUser(e)}
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
