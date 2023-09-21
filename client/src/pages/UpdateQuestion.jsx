import {
  Stack,
  Heading,
  useColorModeValue,
  FormControl,
  FormLabel,
  Input,
  Button,
} from "@chakra-ui/react";
import { updateQuestionStore } from "../stores/updateQuestionStore";
import { observer } from "mobx-react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { useEffect } from "react";

export const UpdateQuestion = observer(() => {
  const navigate = useNavigate();
  const state = updateQuestionStore.state;

  const updateQuestion = async (e) => {
    e.preventDefault();
    await updateQuestionStore.updateQuestionById("1"); //passing in temp id of 1, #TODO is it supposed to be e?
  };

  useEffect(async () => {
    await updateQuestionStore.getQuestionById("1"); // same passing in temp id of 1 because we don't know how we are going to pass an id in just yet.
  }, []);

  return (
    <PageContainer>
      <Stack
        spacing={4}
        w={"full"}
        maxW={"lg"}
        bg={useColorModeValue("white", "gray.700")}
        rounded={"xl"}
        boxShadow={"lg"}
        p={6}
        my={12}
      >
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Question Edit
        </Heading>
        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="Title"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={state.title}
            onChange={(e) => {
              updateQuestionStore.setTitle(e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Input
            placeholder="Question description"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={state.description}
            onChange={(e) => {
              updateQuestionStore.setDescription(e.target.value);
            }}
          />
        </FormControl>
        <Stack spacing={6} direction={["column", "row"]}>
          <Button
            bg={"red.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "red.500",
            }}
            onClick={() => {
              navigate(-1);
            }}
          >
            Cancel
          </Button>
          <Button
            bg={"blue.400"}
            color={"white"}
            w="full"
            _hover={{
              bg: "blue.500",
            }}
            onClick={async (e) => await updateQuestion(e)}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
});
