import {
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { updateUserStore } from "../stores/updateUserStore";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { PageContainer } from "../components/PageContainer";

export const UpdateUser = observer(() => {
  const navigate = useNavigate();
  const toast = useToast();
  const store = updateUserStore;
  const state = store.state;
  const userId = JSON.parse(localStorage.getItem("user")).uid;

  const updateUser = () => {
    toast.promise(store.updateUser(userId), {
      success: () => {
        navigate("/me");
        return {
          title: "Successfully updated account.",
          description: "You've successfully updated your account!",
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
        title: "Updating Account.",
        description: "Please give us some time to update your account.",
        duration: 3000,
        isClosable: true,
      },
    });
  };

  useEffect(() => {
    store.populateStateWithUserById(userId);
  }, []);

  return (
    <PageContainer>
      <Stack spacing={8} maxW={"lg"} p={6}>
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          User Profile Edit
        </Heading>
        {/* <FormControl id="userIcon">
          <FormLabel>User Icon</FormLabel>
          <Stack direction={["column", "row"]} spacing={6}>
            <Center>
              <Avatar size="xl" src="<add profile picture source here>">
                <AvatarBadge
                  as={IconButton}
                  size="sm"
                  rounded="full"
                  top="-10px"
                  colorScheme="red"
                  aria-label="remove Image"
                  icon={<SmallCloseIcon />}
                />
              </Avatar>
            </Center>
            <Center w="full">
              <Button w="full">Change Icon</Button>
            </Center>
          </Stack>
        </FormControl> */}
        <FormControl id="userName" isRequired>
          <FormLabel>User name</FormLabel>
          <Input
            placeholder="UserName"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={state.username}
            onChange={(e) => {
              updateUserStore.setUsername(e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email address</FormLabel>
          <Input
            placeholder="your-email@example.com"
            _placeholder={{ color: "gray.500" }}
            type="email"
            value={state.email}
            onChange={(e) => {
              updateUserStore.setEmail(e.target.value);
            }}
          />
        </FormControl>
        {/* <FormControl id="password" isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl> */}
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"#F07272"}
            color={"white"}
            _hover={{
              bg: "#EC4E4E",
            }}
            w="full"
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"#706CCC"}
            _hover={{
              bg: "#8F8ADD",
            }}
            color={"white"}
            w="full"
            onClick={async (e) => await updateUser(e)}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
});
