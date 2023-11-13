import {
  Button,
  Heading,
  Stack,
  Text,
  SimpleGrid,
  IconButton,
  useToast,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { viewUserStore } from "../stores/viewUserStore";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { Fragment, useEffect } from "react";
import { PageContainer } from "../components/PageContainer";

export const ViewUser = observer(() => {
  const navigate = useNavigate();
  const toast = useToast();
  const store = viewUserStore;
  const state = store.state;
  const userId = JSON.parse(localStorage.getItem("user"))?.uid;

  const redirectToUpdateUserPage = () => {
    navigate("/update-user");
  };

  const deleteUser = () => {
    window.confirm(
      "Are you sure you want to delete your account? This action is irreversible."
    )
      ? toast.promise(store.deleteUser(userId), {
          success: () => {
            localStorage.removeItem("user");
            navigate("/");
            return {
              title: "Successfully deleted account.",
              description: "You've successfully deleted your account!",
              duration: 3000,
              isClosable: true,
            };
          },
          error: (error) => ({
            title: "An error occurred.",
            description:
              error.response.data.message || "Unknown error occurred.",
            duration: 3000,
            isClosable: true,
          }),
          loading: {
            title: "Deleting Account.",
            description: "Please give us some time to delete your account.",
            duration: 3000,
            isClosable: true,
          },
        })
      : {};
  };

  useEffect(() => {
    store.populateStateWithUserById(userId);
  }, []);

  return (
    <PageContainer>
      {/* The fragment is needed coz PageContainer's children prop is a single object*/}
      <>
        <IconButton
          icon={<ArrowBackIcon />}
          variant={"ghost"}
          marginRight={"5px"}
          color={"#706CCC"}
          onClick={() => {
            navigate(-1);
          }}
        />
        <Stack spacing={4} w={"full"} maxW={"lg"}>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            User Profile Details
          </Heading>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            {Object.entries(state).map((item, index) => (
              <Fragment key={index}>
                <Text fontWeight="bold">{item[0]}:</Text>
                <Text>{item[1]}</Text>
              </Fragment>
            ))}
          </SimpleGrid>
          <Stack spacing={6} direction={["column", "row"]}>
            <Button
              bg={"#F07272"}
              color={"white"}
              _hover={{
                bg: "#EC4E4E",
              }}
              w="full"
              onClick={deleteUser}
            >
              Delete your profile
            </Button>
            <Button
              bg={"#706CCC"}
              _hover={{
                bg: "#8F8ADD",
              }}
              color={"white"}
              w="full"
              onClick={redirectToUpdateUserPage}
            >
              Update your profile
            </Button>
          </Stack>
        </Stack>
      </>
    </PageContainer>
  );
});
