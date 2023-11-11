import {
  Button,
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
  TableContainer,
  Table,
  TableCaption,
  Thead,
  Tr,
  Th,
  Tbody,
  Td,
  IconButton,
} from "@chakra-ui/react";
import { SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { useEffect } from "react";
import { viewQuestionsStore } from "../stores/viewQuestionsStore";
import { useModalComponentStore } from "../contextProviders/modalContext";
import { getColorFromComplexity } from "../utils/stylingUtils";

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
