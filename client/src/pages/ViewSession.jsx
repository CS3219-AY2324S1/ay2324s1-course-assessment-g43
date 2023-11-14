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
  Tooltip,
} from "@chakra-ui/react";
import { viewSessionStore } from "../stores/viewSessionStore";
import { observer } from "mobx-react";
import { useNavigate, useParams } from "react-router-dom";
import { PageContainer } from "../components/PageContainer";
import { ScrollableText } from "../components/ScrollableText";
import { CodeEditor } from "../components/CodeEditor";
import { useModalComponentStore } from "../contextProviders/modalContext";
import { useEffect, useState } from "react";
import { viewHistoryStore } from "../stores/viewHistoryStore";
import { getColorFromComplexity } from "../utils/stylingUtils";
import { ChatBox } from "../components/ChatBox";

export const ViewSession = observer(() => {
  const navigate = useNavigate();
  const param = useParams();
  const toast = useToast();

  const [isDoneLoading, setIsDoneLoading] = useState(false);
  const store = viewSessionStore;
  const state = store.state;
  const modalComponentStore = useModalComponentStore();
  const historyStore = viewHistoryStore;

  useEffect(() => {
    const roomId = param.id;
    store
      .fetchSession(roomId)
      .then((session) => {
        //TODO can we refactor this to the case below?
        console.log("fetched session");
        console.log(session);

        store.setRoomId(roomId);
        store.initiateSessionState(session);
        store.initSocket(
          leaveSessionCallback,
          receiveRequestCallback,
          changeQuestionCallback,
          rejectRequestCallback
        );
        store.setChat(localStorage.getItem("sessionChat"));
      })
      .catch((err) => {
        // ! Important
        // ! If GET /session/:roomId returns 404, delete roomId and other cached session info from localStorage
        // * Be careful when updating the err.message string
        if (err.message === "Session is invalid.") {
          if (localStorage.getItem("roomId") === roomId) {
            localStorage.removeItem("roomId");
            localStorage.removeItem("sessionLanguage");
            localStorage.removeItem("sessionChat");
          }
        }
        navigate("/");
      })
      .finally(() => {
        setIsDoneLoading(true);
      });

    return () => {
      store.resetState();
      store.disconnectFromServer();
    };
  }, []);

  const createAttempt = async () => {
    const userData = localStorage.getItem("user");
    const userObject = JSON.parse(userData);
    const uid = userObject.uid;
    const qid = store.state.questionId;

    console.log("hiii");
    console.log(qid);

    const attempt = {
      currentUserId: uid,
      title: store.state.title,
      description: store.state.description,
      category: store.state.category,
      complexity: store.state.complexity,
      attemptDetails: {
        code: store.state.code,
        language: store.state.language,
      }
    };
    console.log(attempt);
    await historyStore.createAttempt(attempt);
  };

  // This callback only runs upon a successful DELETE from the Sessions collection
  const leaveSessionCallback = async () => {
    //Save Attempt To History
    await createAttempt();

    // Remove roomId & sessionLanguage from localStorage
    localStorage.removeItem("roomId");
    localStorage.removeItem("sessionLanguage");
    localStorage.removeItem("sessionChat");
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

  const nextQuestionModalBody =
    "Your partner has requested to move on to the next question. Do you accept?";

  const NextQuestionModalFooter = observer(() => {
    const handleCancel = (e) => {
      e.preventDefault();

      store.rejectChangeQuestion();
      modalComponentStore.closeModal();
    };

    return (
      <>
        <Button
          bg={"#F07272"}
          color={"white"}
          _hover={{
            bg: "#EC4E4E",
          }}
          mr={3}
          onClick={handleCancel}
        >
          Decline
        </Button>
        <Button
          bg={"#706CCC"}
          _hover={{
            bg: "#8F8ADD",
          }}
          color={"white"}
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
  };

  const changeQuestionCallback = async () => {
    await createAttempt();
    navigate(0);
  };

  const rejectRequestCallback = () => {
    store.setIsGetQuestionLoading(false);
    toast({
      title: `Your partner has rejected your request, try again later.`,
      status: "warning",
      duration: 8000,
      isClosable: true,
    });
  };

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
            lineHeight={1}
            fontSize={{ base: "l", sm: "xl" }}
            fontWeight={"semibold"}
          >
            Matched Difficulty: {}
            <Badge bg={getColorFromComplexity(state.complexity)}>
              {state.complexity}
            </Badge>
          </Heading>
          <Button
            color="#EC4E4E"
            borderColor="#EC4E4E"
            variant="outline"
            mr={3}
            onClick={handleLeaveSession}
            _hover={{
              bg: "#F8C1C1",
            }}
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
            <HStack
              spacing={2}
              paddingBlock={3}
              maxW={"100%"}
              overflowX={"auto"}
            >
              {state.category?.map((category) => (
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
                roomId={state.roomId}
                language={state.language}
                otherUsername={state.otherUserName}
                onLanguageChange={(newLang) => store.setLanguage(newLang)}
                initialTemplate={state.attempt}
                code={state.code}
                isGetNextQuestionLoading={state.isGetNextQuestionLoading}
              />
            )}{" "}
            <Divider />
            <ChatBox
              chat={state.chat}
              otherUserName={state.otherUserName}
              isPeerConnected={state.isPeerConnected}
              onSendMessage={(newMessage) => {
                store.pushAndSendMessage(newMessage);
              }}
            />
          </Stack>
        </HStack>
      </Stack>
    </PageContainer>
  );
});
