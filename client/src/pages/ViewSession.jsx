import {
  Stack,
  Heading,
  Button,
  HStack,
  Tag,
  TagLabel,
  Badge,
  Divider,
  Box,
  AbsoluteCenter,
  Text,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";
import { viewSessionStore } from "../stores/viewSessionStore";
import { observer } from "mobx-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ScrollableText } from "../components/ScrollableText";
import { CodeEditor } from "../components/CodeEditor";
import { useEffect } from "react";

export const ViewSession = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: roomId } = useParams();
  const store = viewSessionStore;
  const state = store.state;

  useEffect(() => {
    store.setQuestionId(location.state.questionId);
    store.setTitle(location.state.title);
    store.setDescription(location.state.description);
    store.setCategory(location.state.category);
    store.setComplexity(location.state.complexity);
  }, []);

  useEffect(() => {
    // TODO: Display error if connection fails?
    store.setRoomId(roomId);
    store.connectToServer();

    return () => {
      store.disconnectFromServer();
    };
  }, []);

  const handleLeaveSession = () => {
    store.disconnectFromServer();
    navigate(-1);
  };

  return (
    <PageContainer w={"100%"}>
      <Stack w={"100%"}>
        <HStack justifyContent={"space-between"}>
          <Heading
            lineHeight={1.1}
            fontSize={{ base: "l", sm: "xl" }}
            fontWeight={"semibold"}
          >
            Matched Difficulty: {}
            <Badge
              colorScheme={
                state.complexity == "Easy"
                  ? "green"
                  : state.complexity == "Medium"
                  ? "yellow"
                  : "red"
              }
            >
              {state.complexity}
            </Badge>
          </Heading>
          <Button
            colorScheme="red"
            variant="outline"
            mr={3}
            onClick={handleLeaveSession}
          >
            Leave Session
          </Button>
        </HStack>
        <Divider />
        <Stack spacing={4} w={"50%"} p={6} align={"start"}>
          <Heading lineHeight={1.1} fontSize={{ base: "2xl", sm: "3xl" }}>
            {state.title}
          </Heading>
          <HStack spacing={2} paddingBlock={3}>
            {state.category?.map((category) => (
              <Tag key={category} borderRadius="full" variant="solid">
                <TagLabel>{category}</TagLabel>
              </Tag>
            ))}
          </HStack>
          <Box position="relative" padding="3" w={"100%"}>
            <Divider />
            <AbsoluteCenter bg="white" px="4">
              Task Discription
            </AbsoluteCenter>
          </Box>
          <ScrollableText text={state.description} />
        </Stack>
        <Divider orientation="vertical" />
        <Stack
          spacing={4}
          w={"50vw"}
          p={6}
          align={"start"}
          direction={"column"}
        >
          <Card w={"100%"} h={"100%"}>
            <CodeEditor />{" "}
          </Card>
          <Card w={"100%"} h={"30vh"}>
            <CardHeader>Peer Chat</CardHeader>
            <Divider color="gray.300" />
            <CardBody>
              <Text color={"gray.500"}>Chat with your partner here.</Text>
            </CardBody>
          </Card>
        </Stack>
      </Stack>
    </PageContainer>
  );
});
