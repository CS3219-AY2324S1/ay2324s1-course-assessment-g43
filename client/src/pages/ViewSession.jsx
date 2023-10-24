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
} from "@chakra-ui/react";
import { viewSessionStore } from "../stores/viewSessionStore";
import { observer } from "mobx-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ScrollableText } from "../components/ScrollableText";
import { CodeEditor } from "../components/CodeEditor";
import { useEffect, useState } from "react";

export const ViewSession = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: roomId } = useParams();
  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const store = viewSessionStore;
  const state = store.state;
  const DEFAULT_LANGUAGE = "text";

  useEffect(() => {
    // Navigate back if no roomId specified
    if (!roomId) {
      console.log("No roomId specified");
      navigate("/");
    }
    if (!location.state || !location.state.questionId) {
      store
        .fetchQuestion(roomId)
        .then((question) => {
          store.initQuestionState(question);
        })
        .catch((err) => {
          console.log(err.message);
          alert("Session is invalid");
          navigate("/");
        })
        .finally(() => {
          setIsDoneLoading(true);
        });
    } else {
      store.setQuestionId(location.state.questionId);
      store.setTitle(location.state.title);
      store.setDescription(location.state.description);
      store.setCategory(location.state.category);
      store.setComplexity(location.state.complexity);
      store.setLanguage(DEFAULT_LANGUAGE);
      setIsDoneLoading(true);
    }

    return () => {
      store.resetState();
    };
  }, []);

  useEffect(() => {
    // TODO: Display error if connection fails?
    store.setRoomId(roomId);
    store.initSocket();

    return () => {
      store.disconnectFromServer();
    };
  }, []);

  const handleLeaveSession = () => {
    store.resetState();
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
        <HStack>
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
              <AbsoluteCenter bg="white" px="4" textAlign={"center"}>
                Task Discription
              </AbsoluteCenter>
            </Box>
            <ScrollableText text={state.description} />
          </Stack>
          <Divider orientation="vertical" />
          {isDoneLoading && (
            <CodeEditor
              questionTitle={state.title}
              roomId={roomId}
              language={state.language}
              onLanguageChange={(newLang) => store.setLanguage(newLang)}
            />
          )}{" "}
        </HStack>
      </Stack>
    </PageContainer>
  );
});
