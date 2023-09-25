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
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { SearchIcon, AddIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { viewQuestionsStore } from "../stores/viewQuestionsStore";

export const ViewQuestions = observer(() => {
  const navigate = useNavigate();

  const toast = useToast();
  const store = viewQuestionsStore;
  const state = store.state;
  const { isOpen, onOpen, onClose } = useDisclosure();

  const redirectToUpdateQuestionPage = () => {
    navigate("/update-question");
  };

  const deleteQuestion = (id) => {
    window.confirm("Delete this question? This action is irreversible.");
    toast.promise(store.deleteQuestion(id), {
      success: () => {
        onClose;
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
    onOpen();
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
            <IconButton aria-label="Search database" icon={<SearchIcon />} />
          </HStack>
        </HStack>
        <ButtonGroup size="sm" isAttached variant="outline">
          <Button>Create new question </Button>
          <IconButton aria-label="Add to friends" icon={<AddIcon />} />
        </ButtonGroup>
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
            <Modal isOpen={isOpen} onClose={onClose} isCentered size={"xl"}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>{state.selectedQuestion.title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Text>{state.selectedQuestion.description}</Text>
                  {/*more details to be added here*/}
                </ModalBody>

                <ModalFooter>
                  <Button
                    colorScheme="blue"
                    mr={3}
                    onClick={redirectToUpdateQuestionPage}
                  >
                    Update Question
                  </Button>
                  <Button
                    variant="ghost"
                    colorScheme="red"
                    onClick={async (e) => await deleteQuestion(e)}
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
