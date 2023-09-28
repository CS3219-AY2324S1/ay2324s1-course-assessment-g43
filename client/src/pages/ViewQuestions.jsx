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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
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

export const ViewQuestions = observer(() => {
  const navigate = useNavigate();

  const toast = useToast();
  const store = viewQuestionsStore;
  const createStore = createQuestionStore;
  const state = store.state;
  const createState = createStore.state;
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure();

  const createQuestion = () => {
    toast.promise(createQuestionStore.createQuestion(), {
      success: () => {
        createStore.clearCategory();
        onCreateClose();
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

  const redirectToUpdateQuestionPage = (selectedQuestion) => {
    navigate("/update-question", {
      state: { selectedQuestion: JSON.stringify(selectedQuestion) },
    });
  };

  const deleteQuestion = (id) => {
    window.confirm("Delete this question? This action is irreversible.");
    toast.promise(store.deleteQuestion(id), {
      success: () => {
        onViewClose();
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
    onViewOpen();
  };

  useEffect(() => {
    store.getAllQuestions();
  }, []);

  return (
    <PageContainer w={"100%"}>
      <Stack spacing={4} w={"100%"}>
        <HStack justifyContent={"space-between"}>
          <Text fontSize="40px" align={"start"}>
            Questions
          </Text>
          <HStack>
            <Input variant="outline" placeholder="Search" width="400px" />
            <IconButton
              aria-label="Search database"
              icon={<SearchIcon />}
              variant={"outline"}
            />
          </HStack>
        </HStack>
        <HStack justify={"right"}>
          <Text>Create new question</Text>
          <IconButton
            aria-label="Create question"
            icon={<AddIcon />}
            variant={"outline"}
            onClick={() => onCreateOpen()}
          />
          <Modal
            isOpen={isCreateOpen}
            onClose={onCreateClose}
            isCentered
            size={"xl"}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Create New Question</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl id="title" isRequired>
                  <FormLabel>Title</FormLabel>
                  <Input
                    placeholder="Question Title"
                    _placeholder={{ color: "gray.500" }}
                    type="text"
                    value={state.title}
                    onChange={(e) => createStore.setTitle(e.target.value)}
                  />
                </FormControl>
                <FormControl id="description" isRequired>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    placeholder="Question description"
                    _placeholder={{ color: "gray.500" }}
                    value={state.description}
                    onChange={(e) => {
                      createStore.setDescription(e.target.value);
                    }}
                  />
                </FormControl>
                <FormControl id="category" isRequired>
                  <FormLabel>Category</FormLabel>
                  <HStack spacing={4} paddingBottom={1}>
                    {createState.category.map((category) => (
                      <Tag key={category} borderRadius="full" variant="solid">
                        <TagLabel>{category}</TagLabel>
                        <TagCloseButton
                          onClick={() => createStore.removeCategory(category)}
                        />
                      </Tag>
                    ))}
                  </HStack>
                  <InputGroup>
                    <Input
                      placeholder="Enter new category"
                      _placeholder={{ color: "gray.500" }}
                      value={createState.creatingCat}
                      onChange={(e) => {
                        createStore.setCreatingCat(e.target.value);
                      }}
                    />
                    <InputRightElement width="4.5rem" justify="right">
                      <IconButton
                        aria-label="Create category"
                        icon={<AddIcon />}
                        variant={"ghost"}
                        onClick={() => createStore.addCategory()}
                      />
                    </InputRightElement>
                  </InputGroup>
                </FormControl>
                <FormControl id="complexity" isRequired>
                  <FormLabel>Complexity</FormLabel>
                  <Select
                    placeholder="Select complexity"
                    value={state.description}
                    onChange={(e) => {
                      createStore.setComplexity(e.target.value);
                    }}
                  >
                    <option>Easy</option>
                    <option>Medium</option>
                    <option>Hard</option>
                  </Select>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="green" mr={3} onClick={createQuestion}>
                  Create Question
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </HStack>
        <Flex justifyContent={"space-between"} px={6}>
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
                  <Flex justifyContent={"space-between"}>
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
        {!!state.selectedQuestion ? (
          <>
            <Modal
              isOpen={isViewOpen}
              onClose={onViewClose}
              isCentered
              size={"xl"}
            >
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{state.selectedQuestion.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Badge
                    colorScheme={
                      state.selectedQuestion.complexity == "Easy"
                        ? "green"
                        : state.selectedQuestion.complexity == "Medium"
                        ? "yellow"
                        : "red"
                    }
                  >
                    {state.selectedQuestion.complexity}
                  </Badge>
                  <HStack spacing={2} paddingBlock={3}>
                    {state.selectedQuestion.category?.map((category) => (
                      <Tag key={category} borderRadius="full" variant="solid">
                        <TagLabel>{category}</TagLabel>
                      </Tag>
                    ))}
                  </HStack>
                  <Box position="relative" padding="3">
                    <Divider />
                    <AbsoluteCenter bg="white" px="4">
                      Task Discription
                    </AbsoluteCenter>
                  </Box>
                  <Text paddingTop={"3"}>
                    {state.selectedQuestion.description}
                  </Text>
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={() =>
                      redirectToUpdateQuestionPage(state.selectedQuestion)
                    }
                  >
                    Update Question
                  </Button>
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    onClick={() =>
                      deleteQuestion(state.selectedQuestion.questionId)
                    }
                  >
                    Delete Question
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </>
        ) : (
          <></>
        )}
      </Stack>
    </PageContainer>
  );
});
