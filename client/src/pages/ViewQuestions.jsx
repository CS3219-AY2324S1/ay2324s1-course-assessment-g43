import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Text,
  Stack,
  IconButton,
  Input,
  useToast,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  InputRightElement,
  InputGroup,
  Tag,
  TagLabel,
  TagCloseButton,
  Badge,
  Divider,
  AbsoluteCenter,
  Box,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { viewQuestionsStore } from "../stores/viewQuestionsStore";
import { createQuestionStore } from "../stores/createQuestionStore";
import { useModalComponentStore } from "../contextProviders/modalContext";

export const ViewQuestions = observer(() => {
  const modalComponentStore = useModalComponentStore();
  const toast = useToast();
  const store = viewQuestionsStore;
  const state = store.state;

  const createQuestion = (e) => {
    e.preventDefault();
    toast.promise(createQuestionStore.createQuestion(), {
      success: () => {
        modalComponentStore.closeModal();
        createQuestionStore.resetState();
        store.getAllQuestions();
        return {
          title: "Question created.",
          description: "Question has been created!",
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
        title: "Creating question.",
        description: "Please give us some time to create the question.",
        duration: 3000,
        isClosable: true,
      },
    });
  };

  const deleteQuestion = (id) => {
    window.confirm("Delete this question? This action is irreversible.");
    toast.promise(store.deleteQuestion(id), {
      success: () => {
        modalComponentStore.closeModal();
        store.setSelectedQuestion({});
        store.getAllQuestions();
        return {
          title: "Successfully deleted question.",
          description: "You've successfully deleted this question!",
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
        title: "Deleting Question.",
        description: "Please give us some time to delete this question.",
        duration: 3000,
        isClosable: true,
      },
    });
  };

  const handleOpenModal = (question) => {
    store.setSelectedQuestion(question);
    modalComponentStore.openModal(
      <ViewQuestionDetailsModalTitle />,
      <ViewQuestionDetailsModalBody />,
      <ViewQuestionDetailsModalFooter />,
      () => deleteQuestion(viewQuestionsStore.state.selectedQuestion.questionId)
    );
  };

  useEffect(() => {
    store.getAllQuestions();
  }, []);

  return (
    <PageContainer w={"100%"}>
      <Stack spacing={4} w={"100%"}>
        <Stack justifyContent={"space-between"} direction={["column", "row"]}>
          <Text fontSize="40px" align={"start"}>
            Questions
          </Text>
          <HStack w={"100%"} justifyContent={"flex-end"}>
            <Input variant="outline" placeholder="Search" maxW={"400px"} />
            <IconButton
              aria-label="Search database"
              icon={<SearchIcon />}
              variant={"outline"}
            />
          </HStack>
        </Stack>
        <HStack justify={"right"}>
          <Text>Create new question</Text>
          <IconButton
            aria-label="Create question"
            icon={<AddIcon />}
            variant={"outline"}
            onClick={() =>
              modalComponentStore.openModal(
                createQuestionModalTitle,
                <CreateQuestionModalBody />,
                <CreateQuestionModalFooter />,
                createQuestion
              )
            }
          />
        </HStack>
        <Flex
          justifyContent={"space-between"}
          px={6}
          direction={["column", "row"]}
        >
          <HStack>
            <Text fontWeight="bold">ID</Text>
            <Text fontWeight="bold">Question Title</Text>
          </HStack>
          <Text fontWeight="bold">Actions</Text>
        </Flex>
        {!!state.questions ? (
          state.questions.map((question, index) => {
            return (
              <Card key={index}>
                <CardBody>
                  <Flex
                    justifyContent={"space-between"}
                    direction={["column", "row"]}
                    gap={2}
                  >
                    <HStack>
                      <Text>{question.questionId}.</Text>
                      <Text textOverflow={"ellipsis"} maxW={"inherit"}>
                        {question.title}
                      </Text>
                    </HStack>
                    <Button onClick={() => handleOpenModal(question)}>
                      View Details
                    </Button>
                  </Flex>
                </CardBody>
              </Card>
            );
          })
        ) : (
          <Card>
            <CardBody>
              {/* eslint-disable-next-line react/no-unescaped-entities*/}
              <Text>Can't seem to find any questions.</Text>
            </CardBody>
          </Card>
        )}
      </Stack>
    </PageContainer>
  );
});

const createQuestionModalTitle = "Create New Question";

const CreateQuestionModalBody = observer(() => {
  return (
    <>
      <FormControl id="title" isRequired>
        <FormLabel>Title</FormLabel>
        <Input
          placeholder="Question Title"
          _placeholder={{ color: "gray.500" }}
          type="text"
          value={createQuestionStore.state.title}
          onChange={(e) => createQuestionStore.setTitle(e.target.value)}
        />
      </FormControl>
      <FormControl id="description" isRequired>
        <FormLabel>Description</FormLabel>
        <Textarea
          placeholder="Question description"
          _placeholder={{ color: "gray.500" }}
          value={createQuestionStore.state.description}
          onChange={(e) => {
            createQuestionStore.setDescription(e.target.value);
          }}
        />
      </FormControl>
      <FormControl id="category">
        <FormLabel>Category</FormLabel>
        <HStack spacing={4} paddingBottom={1}>
          {createQuestionStore.state.category.map((category) => (
            <Tag key={category} borderRadius="full" variant="solid">
              <TagLabel>{category}</TagLabel>
              <TagCloseButton
                onClick={() => createQuestionStore.removeCategory(category)}
              />
            </Tag>
          ))}
        </HStack>
        <InputGroup>
          <Input
            placeholder="Enter new category"
            _placeholder={{ color: "gray.500" }}
            value={createQuestionStore.state.creatingCat}
            onChange={(e) => {
              createQuestionStore.setCreatingCat(e.target.value);
            }}
          />
          <InputRightElement width="4.5rem" justify="right">
            <IconButton
              aria-label="Create category"
              icon={<AddIcon />}
              variant={"unstyled"}
              onClick={() => createQuestionStore.addCategory()}
            />
          </InputRightElement>
        </InputGroup>
      </FormControl>
      <FormControl id="complexity" isRequired>
        <FormLabel>Complexity</FormLabel>
        <Select
          placeholder="Select complexity"
          value={createQuestionStore.state.complexity}
          onChange={(e) => {
            createQuestionStore.setComplexity(e.target.value);
          }}
        >
          <option>Easy</option>
          <option>Medium</option>
          <option>Hard</option>
        </Select>
      </FormControl>
    </>
  );
});

const CreateQuestionModalFooter = () => {
  return (
    <Button colorScheme="green" mr={3} type="submit">
      Create Question
    </Button>
  );
};

const ViewQuestionDetailsModalTitle = observer(() => {
  return <div>{viewQuestionsStore.state.selectedQuestion.title}</div>;
});

const ViewQuestionDetailsModalBody = observer(() => {
  return (
    <>
      <Badge
        colorScheme={
          viewQuestionsStore.state.selectedQuestion.complexity == "Easy"
            ? "green"
            : viewQuestionsStore.state.selectedQuestion.complexity == "Medium"
            ? "yellow"
            : "red"
        }
      >
        {viewQuestionsStore.state.selectedQuestion.complexity}
      </Badge>
      <HStack spacing={2} paddingBlock={3}>
        {viewQuestionsStore.state.selectedQuestion.category?.map((category) => (
          <Tag key={category} borderRadius="full" variant="solid">
            <TagLabel>{category}</TagLabel>
          </Tag>
        ))}
      </HStack>
      <Box position="relative" padding="3">
        <Divider />
        <AbsoluteCenter bg="white" px="4">
          Task Description
        </AbsoluteCenter>
      </Box>
      {viewQuestionsStore.state.selectedQuestion.description &&
        viewQuestionsStore.state.selectedQuestion.description
          .split("\n")
          .map((p) => <Text py={1}>{p}</Text>)}
    </>
  );
});

const ViewQuestionDetailsModalFooter = observer(() => {
  const navigate = useNavigate();
  const modalComponentStore = useModalComponentStore();
  const redirectToUpdateQuestionPage = (selectedQuestion) => {
    modalComponentStore.closeModal();
    navigate("/update-question", {
      state: { selectedQuestion: JSON.stringify(selectedQuestion) },
    });
  };
  return (
    <>
      <Button
        colorScheme="blue"
        mr={3}
        onClick={() =>
          redirectToUpdateQuestionPage(
            viewQuestionsStore.state.selectedQuestion
          )
        }
      >
        Update Question
      </Button>
      <Button variant="ghost" colorScheme="red" type="submit">
        Delete Question
      </Button>
    </>
  );
});
