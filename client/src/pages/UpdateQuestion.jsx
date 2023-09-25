import {
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { updateQuestionStore } from "../stores/updateQuestionStore";
import { observer } from "mobx-react";
import { useLocation, useNavigate } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { useEffect } from "react";

export const UpdateQuestion = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const store = updateQuestionStore;
  const state = store.state;

  const updateQuestion = () => {
    toast.promise(store.updateQuestionById(), {
      success: () => {
        navigate("/browse");
        return {
          title: "Successfully updated.",
          description: "You've successfully updated the question!",
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
        title: "Updating question.",
        description: "Please give us some time to update the question.",
        duration: 3000,
        isClosable: true,
      },
    });
  };

  useEffect(() => {
    const selectedQuestion = JSON.parse(location.state.selectedQuestion);
    store.setQuestionId(selectedQuestion.questionId);
    store.setTitle(selectedQuestion.title);
    store.setDescription(selectedQuestion.description);
    store.setCategory(selectedQuestion.category);
    store.setComplexity(selectedQuestion.complexity);
  }, []);

  return (
    <PageContainer w={"100%"}>
      <Stack spacing={4} w={"100%"} p={6}>
        <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
          Update Question
        </Heading>
        <FormControl id="title" isRequired>
          <FormLabel>Title</FormLabel>
          <Input
            placeholder="Title"
            _placeholder={{ color: "gray.500" }}
            type="text"
            value={state.title}
            onChange={(e) => {
              store.setTitle(e.target.value);
            }}
          />
        </FormControl>
        <FormControl id="description" isRequired>
          <FormLabel>Description</FormLabel>
          <Textarea
            placeholder="Question description"
            _placeholder={{ color: "gray.500" }}
            value={state.description}
            onChange={(e) => {
              store.setDescription(e.target.value);
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
