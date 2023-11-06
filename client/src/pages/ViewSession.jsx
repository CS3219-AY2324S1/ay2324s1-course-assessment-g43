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
  useToast,
} from "@chakra-ui/react";
import { viewSessionStore } from "../stores/viewSessionStore";
import { observer } from "mobx-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ScrollableText } from "../components/ScrollableText";
import { CodeEditor } from "../components/CodeEditor";
import { useModalComponentStore } from "../contextProviders/modalContext";
import { useEffect, useState } from "react";
import { viewHistoryStore } from "../stores/viewHistoryStore";

export const ViewSession = observer(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const param = useParams();
  const toast = useToast();

  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const store = viewSessionStore;
  const state = store.state;
  const DEFAULT_LANGUAGE = "text";
  const modalComponentStore = useModalComponentStore();
  const historyStore = viewHistoryStore;

  useEffect(() => {
    const roomId = param.id;

    // Navigate back if no roomId specified
    if (!roomId) {
      console.log("No roomId specified");
      navigate("/");
    }
    if (!location.state || !location.state.questionId) {
      // Case when user resumes an existing session
      store
        .fetchQuestion(roomId)
        .then((question) => {
          //TODO can we refactor this to the case below?
          store.setRoomId(roomId);
          store.initQuestionState(question);
          store.initSocket(leaveSessionCallback, receiveRequestCallback, changeQuestionCallback, rejectRequestCallback);
          store.setLanguage(
            localStorage.getItem("sessionLanguage") ?? DEFAULT_LANGUAGE
          );
        })
        .catch((err) => {
          let message = err.message;
          // If GET /session/:roomId returns 404, delete roomId from localStorage
          // * Be careful when updating the err.message string
          if (err.message === "Session is invalid.") {
            if (localStorage.getItem("roomId") === roomId) {
              localStorage.removeItem("roomId");
              message = "This session has been closed by your partner.";
            }
          }
          alert(`Error: ${message}`);
          navigate("/");
        })
        .finally(() => {
          setIsDoneLoading(true);
        });
    } else {
      // Case when user comes from on the successful creation of a new session
      store.setRoomId(roomId);
      store.setQuestionId(location.state.questionId);
      store.setTitle(location.state.title);
      store.setDescription(location.state.description);
      store.setCategory(location.state.category);
      store.setComplexity(location.state.complexity);
      store.setLanguage(
        localStorage.getItem("sessionLanguage") ?? DEFAULT_LANGUAGE
      );
      setIsDoneLoading(true);

      store.initSocket(leaveSessionCallback, receiveRequestCallback, changeQuestionCallback, rejectRequestCallback);
    }

    return () => {
      store.resetState();
      store.disconnectFromServer();
    };
  }, []);

  const createAttempt = async () => {
    const userData = localStorage.getItem("user");
    const userObject = JSON.parse(userData);
    const uid = userObject.uid;
    const attempt = {
      currentUserId: uid,
      title: store.state.title,
      description: store.state.description,
      category: store.state.category,
      complexity: store.state.complexity,
    }
    console.log(attempt);
    await historyStore.createAttempt(attempt);
  }

  // This callback only runs upon a successful DELETE from the Sessions collection
  const leaveSessionCallback = async() => {
    //Save Attempt To History
    await createAttempt();

    // Remove roomId & sessionLanguage from localStorage
    localStorage.removeItem("roomId");
    localStorage.removeItem("sessionLanguage");
    store.resetState();
    navigate(-1);
    toast({
      title: `Session has ended. Hope you enjoyed your coding session!`,
      status: "success",
      duration: 8000,
      isClosable: true,
    });
  };

  const nextQuestionModalTitle = "Accept Request?";

  const nextQuestionModalBody = "Your partner has requested to move on to the next question. Do you agree?";

  const NextQuestionModalFooter = observer(() => {
    
    const handleCancel = (e) => {
      e.preventDefault();

      store.rejectChangeQuestion();
      modalComponentStore.closeModal();
    };

    return (
      <>
        <Button
          colorScheme="red"
          mr={3}
          onClick={handleCancel}
        >
          Decline
        </Button>
        <Button
        colorScheme="green"
        mr={3}
        type="submit"
      >
        Accept
      </Button>
      </>
    );
  });

  const receiveRequestCallback = () => {
    modalComponentStore.openModal(
      nextQuestionModalTitle,
      nextQuestionModalBody,
      <NextQuestionModalFooter />,
      (e) => {
        e.preventDefault();
        store.acceptChangeQuestion(changeQuestionCallback);
      },
      () => {}
    );

    modalComponentStore.setClosable(false);
  }

  const changeQuestionCallback = async () => {
    await createAttempt();
    navigate(0);
  }

  const rejectRequestCallback = () => {
    store.setIsGetQuestionLoading(false);
    toast({
      title: `Your partner has rejected your request, try again later.`,
      status: "warning",
      duration: 8000,
      isClosable: true,
    });
  }

  const handleLeaveSession = async () => {
    if (
      confirm(
        "You and your partner will be disconnected from the session Are you sure?"
      )
    ) {
      await store.initLeaveRoom();
      leaveSessionCallback();
    }
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
                Task Description
              </AbsoluteCenter>
            </Box>
            <ScrollableText text={state.description} />
          </Stack>
          <Divider orientation="vertical" />
          <Stack w={"50%"}>
            {isDoneLoading && (
              <CodeEditor
                questionTitle={state.title}
                roomId={state.roomId}
                language={state.language}
                onLanguageChange={(newLang) => store.setLanguage(newLang)}
                isGetNextQuestionLoading = {state.isGetNextQuestionLoading}
              />
            )}{" "}
          </Stack>
        </HStack>
      </Stack>
    </PageContainer>
  );
});
