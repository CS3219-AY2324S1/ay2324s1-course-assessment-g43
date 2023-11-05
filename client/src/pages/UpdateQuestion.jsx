import {
  Stack,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  useToast,
  HStack,
  Tag,
  TagLabel,
  TagCloseButton,
  InputGroup,
  InputRightElement,
  IconButton,
  Select,
  Tooltip,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
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
        navigate("/browse-admin");
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
        <Heading
          color={"#0A050E"}
          lineHeight={1.1}
          fontSize={{ base: "2xl", sm: "3xl" }}
        >
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
        <FormControl id="category">
          <FormLabel>Category</FormLabel>
          <HStack spacing={4} paddingBottom={1}>
            {state.category?.map((category) => (
              <Tooltip key={category} label={category} bg={"#706CCC"}>
                <Tag
                  key={category}
                  borderRadius="full"
                  variant="solid"
                  bg={"#B7B5E4"}
                  color={"white"}
                  maxW={"20%"}
                >
                  <TagLabel>{category}</TagLabel>
                  <TagCloseButton
                    onClick={() => store.removeCategory(category)}
                  />
                </Tag>
              </Tooltip>
            ))}
          </HStack>
          <InputGroup>
            <Input
              placeholder="Enter new category"
              _placeholder={{ color: "gray.500" }}
              value={state.updatingCat}
              onChange={(e) => {
                store.setUpdatingCat(e.target.value);
              }}
            />
            <InputRightElement width="4.5rem" justify="right">
              <IconButton
                aria-label="Create category"
                icon={<AddIcon />}
                variant="unstyled"
                paddingBottom={"3px"}
                onClick={() => store.addCategory()}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>
        <FormControl id="complexity" isRequired>
          <FormLabel>Complexity</FormLabel>
          <Select
            value={state.complexity}
            onChange={(e) => {
              store.setComplexity(e.target.value);
            }}
          >
            <option>Easy</option>
            <option>Medium</option>
            <option>Hard</option>
          </Select>
        </FormControl>
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
            w="full"
            bg={"#706CCC"}
            _hover={{
              bg: "#8F8ADD",
            }}
            color={"white"}
            onClick={async (e) => await updateQuestion(e)}
          >
            Submit
          </Button>
        </Stack>
      </Stack>
    </PageContainer>
  );
});
