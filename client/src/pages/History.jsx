import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Badge,
  HStack,
  Tag,
  TagLabel,
  Box,
  Divider,
  AbsoluteCenter,
  Text,
  IconButton,
  Tooltip,
  Button,
  Heading,
  Stack,
  Flex,
  TagCloseButton,
  InputGroup,
  InputLeftElement,
  Input,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { viewHistoryStore } from "../stores/viewHistoryStore";
import { useModalComponentStore } from "../contextProviders/modalContext";
import { useEffect } from "react";
import { EditIcon, SearchIcon, ViewIcon } from "@chakra-ui/icons";
import { getColorFromComplexity } from "../utils/stylingUtils";
import { Editor } from "@monaco-editor/react";

export const History = observer(() => {
  const store = viewHistoryStore;
  const state = store.state;
  const userData = localStorage.getItem("user");
  const userObject = JSON.parse(userData);
  const uid = userObject?.uid;
  const modalComponentStore = useModalComponentStore();

  const COMPLEXITY_LEVELS = ["Easy", "Medium", "Hard"];

  const handleOpenDetailsModal = (attempt) => {
    store.setSelectedAttempt(attempt);
    modalComponentStore.openModal(
      <ViewAttemptDetailsModalTitle />,
      <ViewAttemptDetailsModalBody />,
      () => store.setSelectedAttempt({})
    );
  };

  const ViewAttemptDetailsModalTitle = observer(() => {
    return <div>{state.selectedAttempt.title}</div>;
  });

  const ViewAttemptDetailsModalBody = observer(() => {
    return (
      <>
        <Badge
          colorScheme={
            state.selectedAttempt.complexity == "Easy"
              ? "green"
              : state.selectedAttempt.complexity == "Medium"
              ? "yellow"
              : "red"
          }
        >
          {state.selectedAttempt.complexity}
        </Badge>
        <HStack spacing={2} paddingBlock={3}>
          {state.selectedAttempt.category?.map((category) => (
            <Tooltip key={category} label={category} bg={"#706CCC"}>
              <Tag
                key={category}
                borderRadius="full"
                variant="solid"
                bg={"#B7B5E4"}
                color={"white"}
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
        {state.selectedAttempt.description &&
          state.selectedAttempt.description.split("\n").map((line, i) => (
            <Text py={1} key={line + i}>
              {line}
            </Text>
          ))}
      </>
    );
  });

  const handleOpenCodeModal = (attempt) => {
    store.setSelectedAttempt(attempt);
    modalComponentStore.openModal(
      <ViewAttemptCodeModalTitle />,
      <ViewAttemptCodeModalBody />,
      () => store.setSelectedAttempt({})
    );
  };

  const ViewAttemptCodeModalTitle = observer(() => {
    return <div>{state.selectedAttempt.title}</div>;
  });

  const ViewAttemptCodeModalBody = observer(() => {
    const options = {
      autoIndent: "full",
      contextmenu: true,
      fontFamily: "monospace",
      fontSize: 15,
      lineHeight: 22,
      hideCursorInOverviewRuler: false,
      matchBrackets: "always",
      minimap: {
        enabled: true,
      },
      scrollbar: {
        horizontalSliderSize: 4,
        verticalSliderSize: 18,
      },
      selectOnLineNumbers: true,
      roundedSelection: false,
      readOnly: true,
      cursorStyle: "line",
      automaticLayout: true,
    };
    return (
      <Editor
        height={"50vh"}
        width={"100%"}
        theme={"vs-dark"}
        value={state.selectedAttempt.attemptDetails.code}
        language={state.selectedAttempt.attemptDetails.language}
        options={options}
      />
    );
  });

  const tableHeaders = [
    {
      key: "datetime",
      label: "Date Attempted",
    },
    {
      key: "title",
      label: "Question Title",
    },
    {
      key: "complexity",
      label: "Complexity",
    },
    {
      key: "details",
      label: "Details",
    },
    {
      key: "code",
      label: "Code",
    },
  ];

  useEffect(() => {
    store.getAttemptsByUserId(uid);
  }, []);

  const attempts = viewHistoryStore.state.attempts;

  return (
    <PageContainer w={"100%"}>
      <Stack align={"center"} w={"100%"}>
        <Flex justifyContent={"space-between"} w={"100%"}>
          <Stack>
            <Heading
              color={"#0A050E"}
              lineHeight={1.1}
              fontSize={{ base: "2xl", sm: "3xl" }}
              fontWeight={"semibold"}
            >
              Attempt History
            </Heading>
            <Text display={{ base: "flex", md: "none" }} color={"#847979"}>
              Scroll right for more
            </Text>
          </Stack>
          <Stack w={"45%"}>
            <InputGroup maxW={"100%"}>
              <InputLeftElement pointerEvents="none">
                <SearchIcon />
              </InputLeftElement>
              <Input
                variant="outline"
                placeholder="Search"
                onChange={(e) => store.setSearchQuery(e.target.value)}
              />
            </InputGroup>
            <HStack justifyContent={"flex-end"}>
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
                  {state.complexityFilters.has(complexity) && (
                    <TagCloseButton />
                  )}
                </Tag>
              ))}
            </HStack>
          </Stack>
        </Flex>
        <TableContainer w={"100%"} maxH={"70vh"} overflowY={"scroll"}>
          <Table variant="simple">
            <TableCaption>
              -
              {attempts?.length !== 0
                ? "End of attempted questions"
                : "No questions attempted"}
              -
            </TableCaption>
            <Thead>
              <Tr>
                {tableHeaders.map((header) => (
                  <Th key={header.key} w={header.key == "title" ? "65%" : ""}>
                    {header.label}
                  </Th>
                ))}
              </Tr>
            </Thead>
            <Tbody>
              {attempts
                .filter((attempt) =>
                  state.complexityFilters.has(attempt["complexity"])
                )
                .filter((attempt) =>
                  attempt["title"]
                    .toLowerCase()
                    .includes(state.searchQuery.toLowerCase())
                )
                .map((attempt, index) => (
                  <Tr key={index}>
                    <Td key="datetime" textOverflow={"ellipsis"}>
                      {attempt["datetime"]}
                    </Td>
                    <Td key="title" textOverflow={"ellipsis"}>
                      {attempt["title"]}
                    </Td>
                    <Td key="complexity">
                      <Badge bg={getColorFromComplexity(attempt["complexity"])}>
                        {attempt["complexity"]}
                      </Badge>
                    </Td>
                    <Td>
                      <IconButton
                        bg={"#BBC2E2"}
                        _hover={{
                          bg: "#DEE2F5",
                        }}
                        onClick={() => handleOpenDetailsModal(attempt)}
                        display={{ base: "flex", lg: "none" }}
                        icon={<ViewIcon />}
                        //dunno what icon to put
                      />
                      <Button
                        bg={"#BBC2E2"}
                        _hover={{
                          bg: "#DEE2F5",
                        }}
                        onClick={() => handleOpenDetailsModal(attempt)}
                        display={{ base: "none", lg: "flex" }}
                      >
                        View Details
                      </Button>
                    </Td>
                    <Td>
                      <IconButton
                        bg={"#BBC2E2"}
                        _hover={{
                          bg: "#DEE2F5",
                        }}
                        onClick={() => handleOpenCodeModal(attempt)}
                        display={{ base: "flex", lg: "none" }}
                        icon={<EditIcon />}
                      />
                      <Button
                        bg={"#BBC2E2"}
                        _hover={{
                          bg: "#DEE2F5",
                        }}
                        onClick={() => handleOpenCodeModal(attempt)}
                        display={{ base: "none", lg: "flex" }}
                      >
                        View Code
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Stack>
    </PageContainer>
  );
});
