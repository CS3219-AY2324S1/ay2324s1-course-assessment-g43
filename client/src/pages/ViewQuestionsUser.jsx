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
  Tag,
  TagLabel,
  Badge,
  Divider,
  AbsoluteCenter,
  Box,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { useEffect } from "react";
import { viewQuestionsStore } from "../stores/viewQuestionsStore";

export const ViewQuestionsUser = observer(() => {
  const store = viewQuestionsStore;
  const state = store.state;
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure();

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
                    variant="outline"
                    mr={3}
                    onClick={() => onViewClose()}
                  >
                    Save Question
                    {/*to update with future functionality*/}
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
