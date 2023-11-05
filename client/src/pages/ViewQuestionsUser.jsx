import {
  Button,
  Card,
  CardBody,
  Flex,
  HStack,
  Text,
  Stack,
  Input,
  InputLeftElement,
  InputGroup,
  Tag,
  TagLabel,
  Badge,
  Divider,
  AbsoluteCenter,
  Box,
  Tooltip,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { useEffect } from "react";
import { viewQuestionsStore } from "../stores/viewQuestionsStore";
import { useModalComponentStore } from "../contextProviders/modalContext";

export const ViewQuestionsUser = observer(() => {
  const modalComponentStore = useModalComponentStore();
  const store = viewQuestionsStore;
  const state = store.state;

  const handleOpenModal = (question) => {
    store.setSelectedQuestion(question);
    modalComponentStore.openModal(
      <ViewQuestionDetailsModalTitle />,
      <ViewQuestionDetailsModalBody />,
      () => viewQuestionsStore.setSelectedQuestion({})
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
        <Flex
          justifyContent={"space-between"}
          px={6}
          direction={["column", "row"]}
        >
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
                        <Badge
                          bg={
                            question.complexity == "Easy"
                              ? "#9DEFCD"
                              : question.complexity == "Medium"
                              ? "#FAF8A5"
                              : "#F8C1C1"
                          }
                        >
                          {question.complexity}
                        </Badge>
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
      </Stack>
    </PageContainer>
  );
});

const ViewQuestionDetailsModalTitle = observer(() => {
  return <div>{viewQuestionsStore.state.selectedQuestion.title}</div>;
});

const ViewQuestionDetailsModalBody = observer(() => {
  return (
    <>
      <Badge
        bg={
          viewQuestionsStore.state.selectedQuestion.complexity == "Easy"
            ? "#9DEFCD"
            : viewQuestionsStore.state.selectedQuestion.complexity == "Medium"
            ? "#FAF8A5"
            : "#F8C1C1"
        }
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
