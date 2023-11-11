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
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { PageContainer } from "../components/PageContainer";
import { viewHistoryStore } from "../stores/viewHistoryStore";
import { useModalComponentStore } from "../contextProviders/modalContext";
import { useEffect } from "react";
import { ViewIcon } from "@chakra-ui/icons";

export const History = observer(() => {
  const store = viewHistoryStore;
  const state = store.state;
  const userData = localStorage.getItem("user");
  const userObject = JSON.parse(userData);
  const uid = userObject?.uid;
  const modalComponentStore = useModalComponentStore();

  const handleOpenModal = (attempt) => {
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
        {state.selectedAttempt.description &&
          state.selectedAttempt.description.split("\n").map((line, i) => (
            <Text py={1} key={line + i}>
              {line}
            </Text>
          ))}
      </>
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
  ];

  useEffect(() => {
    store.getAttemptsByUserId(uid);
  }, []);

  const attempts = viewHistoryStore.state.attempts;

  return (
    <PageContainer w={"100%"}>
      <TableContainer w={"100%"}>
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
            {attempts.map((attempt, index) => (
              <Tr key={index}>
                <Td key="datetime">{attempt["datetime"]}</Td>
                <Td key="title">{attempt["title"]}</Td>
                <Td key="complexity">
                  <Badge
                    bg={
                      attempt["complexity"] == "Easy"
                        ? "#9DEFCD"
                        : attempt["complexity"] == "Medium"
                        ? "#FAF8A5"
                        : "#F8C1C1"
                    }
                  >
                    {attempt["complexity"]}
                  </Badge>
                </Td>
                <Td>
                  <IconButton
                    bg={"#BBC2E2"}
                    _hover={{
                      bg: "#DEE2F5",
                    }}
                    onClick={() => handleOpenModal(attempt)}
                    display={{ base: "flex", md: "none" }}
                    icon={<ViewIcon />}
                    //dunno what icon to put
                  />
                  <Button
                    bg={"#BBC2E2"}
                    _hover={{
                      bg: "#DEE2F5",
                    }}
                    onClick={() => handleOpenModal(attempt)}
                    display={{ base: "none", md: "flex" }}
                  >
                    View Details
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </PageContainer>
  );
});
