import {
  Button,
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
  InputLeftElement,
  InputRightElement,
  InputGroup,
  Tag,
  TagLabel,
  TagCloseButton,
  Badge,
  Divider,
  AbsoluteCenter,
  Box,
  Tooltip,
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  Flex,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon, ViewIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { viewQuestionsStore } from "../stores/viewQuestionsStore";
import { createQuestionStore } from "../stores/createQuestionStore";
import { useModalComponentStore } from "../contextProviders/modalContext";
import { getColorFromComplexity } from "../utils/stylingUtils";

export const ViewQuestions = observer(() => {
  const modalComponentStore = useModalComponentStore();
  const toast = useToast();
  const store = viewQuestionsStore;
  const state = store.state;

  const COMPLEXITY_LEVELS = ["Easy", "Medium", "Hard"];

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
    window.confirm("Delete this question? This action is irreversible.") == true
      ? toast.promise(store.deleteQuestion(id), {
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
            description:
              error.response.data.message || "Unknown error occurred.",
            duration: 3000,
            isClosable: true,
          }),
          loading: {
            title: "Deleting Question.",
            description: "Please give us some time to delete this question.",
            duration: 3000,
            isClosable: true,
          },
        })
      : {};
  };

  const handleOpenModal = (question) => {
    store.setSelectedQuestion(question);
    modalComponentStore.openModal(
      <ViewQuestionDetailsModalTitle />,
      <ViewQuestionDetailsModalBody />,
      <ViewQuestionDetailsModalFooter />,
      () =>
        deleteQuestion(viewQuestionsStore.state.selectedQuestion.questionId),
      () => viewQuestionsStore.setSelectedQuestion({})
    );
  };

  const handleOpenCreateModal = () => {
    modalComponentStore.openModal(
      createQuestionModalTitle,
      <CreateQuestionModalBody />,
      <CreateQuestionModalFooter />,
      createQuestion,
      () => createQuestionStore.resetState()
    );
  };

  useEffect(() => {
    store.getAllQuestions();
  }, []);

  return (
    <PageContainer w={"100%"}>
      <Stack spacing={4} w={"100%"}>
        <Stack justifyContent={"space-between"} direction={["column", "row"]}>
          <Text fontSize="40px" align={"start"} fontWeight={"semibold"}>
            Questions
          </Text>
          <HStack w={"100%"} justifyContent={"flex-end"}>
            <InputGroup maxW={"60%"}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon />
              </InputLeftElement>
              <Input
                variant="outline"
                placeholder="Search"
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
            </InputGroup>
          </HStack>
        </Stack>
        <Flex justifyContent={"space-between"}>
          <HStack>
            {COMPLEXITY_LEVELS.map((complexity) => (
              <Tag
                size="md"
                key={complexity}
                bg={
                  state.complexityFilters.has(complexity)
                    ? getColorFromComplexity(complexity)
                    : "gray"
                }
                onClick={() => store.toggleComplexityFilter(complexity)}
              >
                <TagLabel>{complexity.toUpperCase()}</TagLabel>
                {state.complexityFilters.has(complexity) && <TagCloseButton />}
              </Tag>
            ))}
          </HStack>
          <HStack justify={"right"}>
            <Text>Create new question</Text>
            <IconButton
              aria-label="Create question"
              icon={<AddIcon />}
              variant={"outline"}
              _hover={{
                bg: "#BBC2E2",
              }}
              onClick={() => handleOpenCreateModal()}
            />
          </HStack>
        </Flex>
        <TableContainer w={"100%"}>
          <Table variant="simple">
            <TableCaption>
              -
              {state.questions?.length !== 0
                ? "End of question list"
                : "No questions added yet"}
              -
            </TableCaption>
            <Thead>
              <Tr>
                <Th key="id" w={"10%"}>
                  ID
                </Th>
                <Th key="title" w={"65%"}>
                  Question Title
                </Th>
                <Th key="complexity" w={"15%"}>
                  Complexity
                </Th>
                <Th key="details" w={"10%"}>
                  Details
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {state.questions
                .filter((question) =>
                  state.complexityFilters.has(question.complexity)
                )
                .filter((question) =>
                  question.title
                    .toLowerCase()
                    .includes(state.searchQuery.toLowerCase())
                )
                .map((question, index) => {
                  return (
                    <Tr key={index}>
                      <Td key="id">{question.questionId}</Td>
                      <Td key="title" textOverflow={"ellipsis"}>
                        {question.title}
                      </Td>
                      <Td key="complexity">
                        <Badge bg={getColorFromComplexity(question.complexity)}>
                          {question.complexity}
                        </Badge>
                      </Td>
                      <Td>
                        <IconButton
                          bg={"#BBC2E2"}
                          _hover={{
                            bg: "#DEE2F5",
                          }}
                          onClick={() => handleOpenModal(question)}
                          display={{ base: "flex", md: "none" }}
                          icon={<ViewIcon />}
                          //dunno what icon to put
                        />
                        <Button
                          bg={"#BBC2E2"}
                          _hover={{
                            bg: "#DEE2F5",
                          }}
                          onClick={() => handleOpenModal(question)}
                          display={{ base: "none", md: "flex" }}
                        >
                          View Details
                        </Button>
                      </Td>
                    </Tr>
                  );
                })}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </PageContainer>
  );
});

const createQuestionModalTitle = "Create New Question";

const CreateQuestionModalBody = observer(() => {
  return (
    <Stack spacing={1}>
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
        <HStack spacing={4} paddingBottom={1} maxW={"100%"}>
          {createQuestionStore.state.category.map((category) => (
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
                  onClick={() => createQuestionStore.removeCategory(category)}
                />
              </Tag>
            </Tooltip>
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
            onKeyPress={(e) => {
              if (e.key == "Enter") {
                createQuestionStore.addCategory();
              }
            }}
          />
          <InputRightElement width="2.5rem" justify="right">
            <IconButton
              aria-label="Create category"
              icon={<AddIcon />}
              variant="ghost"
              _hover={{
                bg: "#DEE2F5",
              }}
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
    </Stack>
  );
});

const CreateQuestionModalFooter = () => {
  return (
    <Button
      bg={"#706CCC"}
      _hover={{
        bg: "#8F8ADD",
      }}
      color={"white"}
      mr={3}
      type="submit"
    >
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
        bg={getColorFromComplexity(
          viewQuestionsStore.state.selectedQuestion.complexity
        )}
      >
        {viewQuestionsStore.state.selectedQuestion.complexity}
      </Badge>
      <HStack spacing={2} paddingBlock={3}>
        {viewQuestionsStore.state.selectedQuestion.category?.map((category) => (
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
            </Tag>
          </Tooltip>
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
          .map((line, i) => (
            <Text py={1} key={line + i}>
              {line}
            </Text>
          ))}
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
    <HStack spacing={1}>
      <Button
        variant="ghost"
        _hover={{ bg: "#F8C1C1" }}
        color={"#EC4E4E"}
        type="submit"
      >
        Delete Question
      </Button>
      <Button
        bg={"#706CCC"}
        _hover={{
          bg: "#8F8ADD",
        }}
        color={"white"}
        mr={3}
        onClick={() =>
          redirectToUpdateQuestionPage(
            viewQuestionsStore.state.selectedQuestion
          )
        }
      >
        Update Question
      </Button>
    </HStack>
  );
});
