import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Text,
  Stack,
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
  InputGroup,
  InputLeftElement,
  Tooltip,
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
        <Stack justifyContent={"space-between"} direction={["column", "row"]}>
          <Text fontSize="40px" align={"start"}>
            Questions
          </Text>
          <HStack>
            <InputGroup maxW={"400px"}>
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
        <Flex justifyContent={"space-between"} px={6}>
          <HStack>
            <Text fontWeight="bold" color={"#463F3A"}>
              ID
            </Text>
            <Text fontWeight="bold" color={"#463F3A"}>
              Question Title
            </Text>
          </HStack>
          <Text fontWeight="bold" color={"#463F3A"}>
            Actions
          </Text>
        </Flex>
        {!!state.questions ? (
          state.questions
            .filter((question) =>
              question.title
                .toLowerCase()
                .includes(state.searchQuery.toLowerCase())
            )
            .map((question, index) => {
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
                      <Button
                        bg={"#BBC2E2"}
                        _hover={{
                          bg: "#DEE2F5",
                        }}
                        onClick={() => handleOpenModal(question)}
                      >
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
                        ? "#9DEFCD"
                        : state.selectedQuestion.complexity == "Medium"
                        ? "#FAF8A5"
                        : "#F8C1C1"
                    }
                  >
                    {state.selectedQuestion.complexity}
                  </Badge>
                  <HStack spacing={2} paddingBlock={3}>
                    {state.selectedQuestion.category?.map((category) => (
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
                </ModalBody>
                <ModalFooter />
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
