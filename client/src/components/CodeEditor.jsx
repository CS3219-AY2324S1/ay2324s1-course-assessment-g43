import {
  Stack,
  Select,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  Flex,
  ButtonGroup,
  Button,
  HStack,
  IconButton,
  Tooltip,
  Text,
  Card,
  CardBody,
  Divider,
} from "@chakra-ui/react";
import { ArrowForwardIcon, ChevronUpIcon, RepeatIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { observer } from "mobx-react";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { PropTypes } from "prop-types";
import { createSubmissionStore } from "../stores/createSubmissionStore";
import { getSubmissionResultStore } from "../stores/getSubmissionResultStore";
import { viewSessionStore } from "../stores/viewSessionStore";

/**
 * `language` prop changes when PEER changes language
 * `onLanguageChange` is a callback function called when USER changes language
 */
export const CodeEditor = observer(
  ({
    roomId,
    language,
    otherUsername,
    initialTemplate,
    code,
    onLanguageChange,
    isGetNextQuestionLoading,
  }) => {
    const WS_SERVER_URL = "ws://localhost:8002";
    const editorRef = useRef(null);
    const decorationsRef = useRef(null);

    const [userLanguage, setUserLanguage] = useState(language);

    const {
      isOpen: isConsoleOpen,
      onOpen: onConsoleOpen,
      onClose: onConsoleClose,
    } = useDisclosure();
    const store = createSubmissionStore;
    const resultStore = getSubmissionResultStore;
    const [isRunLoading, setRunLoading] = useState(false);
    const [isPressed, setPressed] = useState(false);

    useEffect(() => {
      // This changes when USER changes language
      // console.log("userLanguage changed to: ", userLanguage);
      if (!userLanguage || userLanguage === language) return;

      async function changeLanguage(roomId, userLanguage, code) {
        const res = await viewSessionStore.changeLanguage(
          roomId,
          userLanguage,
          code
        );
        return res;
      }

      changeLanguage(roomId, userLanguage, code)
        .then((res) => {
          const newCode = res.data.code;

          viewSessionStore.setCode(newCode);

          onLanguageChange(userLanguage); // Notify peer
        })
        .catch((err) => {
          console.log(err);
        });
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLanguage]);

    useEffect(() => {
      // This changes when PEER changes language
      // console.log("PEER changed language changed to: ", language);
      if (language === userLanguage) return;
      setUserLanguage(language);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

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
      readOnly: false,
      cursorStyle: "line",
      automaticLayout: true,
    };

    const setStoreLanguage = useCallback((lang) => {
      switch (lang) {
        case "cpp":
          store.setLanguageId(54);
          return;
        case "java":
          store.setLanguageId(62);
          return;
        case "python":
          store.setLanguageId(71);
          return;
        case "javascript":
          store.setLanguageId(93);
          return;
        default:
          return ``;
      }
    }, []);

    const initiateNextQuestionRequest = () => {
      viewSessionStore.initChangeQuestion();
      viewSessionStore.setIsGetQuestionLoading(true);
    };

    const resetCode = async () => {
      if (
        confirm(
          "Are you sure? Your current code will be discarded and reset to the default code!"
        )
      ) {
        const res = await viewSessionStore.resetCode(roomId);
        const newCode = res.data.code;

        viewSessionStore.setCode(newCode);
      }
    };

    const handleEditorChange = (currContent) => {
      if (!currContent) return;
      viewSessionStore.setCode(currContent);
    };

    async function getEditorValue() {
      console.log(editorRef.current.getValue());

      try {
        const token = await store.createSubmission();
        console.log(token);
        resultStore.setToken(token);
        await new Promise((resolve) => {
          setTimeout(resolve, 2000); // 2000 milliseconds (2 seconds)
        });

        const result = await resultStore.getSubmissionResult();
        console.log(result);
      } catch (error) {
        console.error(error);
      }
    }

    async function handleRunButtonClick() {
      setPressed(true);
      setRunLoading(true);

      setStoreLanguage(userLanguage.toLowerCase());
      store.setSourceCode(code);

      try {
        await getEditorValue();
      } catch (error) {
        // Handle errors here
        console.error(error);
      } finally {
        setPressed(false);
        setRunLoading(false);
        onConsoleOpen();
      }
    }

    // eslint-disable-next-line no-unused-vars
    function handleEditorDidMount(editor, monaco) {
      editorRef.current = editor;
      //Init YJS
      const doc = new Y.Doc(); //collection of shared objects

      const provider = new WebsocketProvider(WS_SERVER_URL, roomId, doc);

      const type = doc.getText("monaco");

      // // Ensures that you initialise the default template once
      provider.once("synced", () => {
        const userId = JSON.parse(localStorage.getItem("user"))["uid"];
        if (roomId.split("-")[1] == userId) {
          viewSessionStore.setCode(initialTemplate[language]);
        }
      });

      // Bind YJS to monaco
      // eslint-disable-next-line no-unused-vars
      const binding = new MonacoBinding(
        type,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        provider.awareness
      );

      decorationsRef.current = editorRef.current.createDecorationsCollection(
        []
      );

      const renderRemoteCursors = () => {
        // Remove previous decorations
        decorationsRef.current.set([]);

        // Loop over all states in the awareness protocol
        const allCursors = provider.awareness
          .getStates()
          .forEach((state, clientId) => {
            if (clientId !== provider.awareness.clientID && state.cursor) {
              // Calculate range from cursor state and create a decoration
              const { start, end, head, userId } = state.cursor;

              if (
                start.lineNumber == end.lineNumber &&
                start.column == end.column
              ) {
                // Simple cursor
                // console.log("simple cursor");
                decorationsRef.current.set([
                  {
                    range: new monaco.Range(
                      head.lineNumber,
                      head.column,
                      head.lineNumber,
                      head.column + 1
                    ),
                    options: {
                      isWholeLine: false,
                      beforeContentClassName: "partner-cursor",
                      hoverMessage: { value: otherUsername },
                    },
                  },
                ]);
              } else {
                // Highlight event
                // console.log("highlight event");
                decorationsRef.current.set([
                  {
                    range: new monaco.Range(
                      start.lineNumber,
                      start.column,
                      end.lineNumber,
                      end.column
                    ),
                    options: {
                      inlineClassName: "partner-highlight",
                      hoverMessage: { value: otherUsername },
                    },
                  },
                  {
                    range: new monaco.Range(
                      head.lineNumber,
                      head.column,
                      head.lineNumber,
                      head.column + 1
                    ),
                    options: {
                      isWholeLine: false,
                      beforeContentClassName: "partner-cursor",
                      hoverMessage: { value: otherUsername },
                    },
                  },
                ]);
              }
            }
          });
      };

      const updateCursorPosition = () => {
        const selection = editorRef.current.getSelection();
        const position = editorRef.current.getPosition();

        // Update the local awareness state
        provider.awareness.setLocalStateField("cursor", {
          start: selection.getStartPosition(),
          end: selection.getEndPosition(),
          head: position,
          userId: JSON.parse(localStorage.getItem("user"))["uid"],
        });
      };

      editor.onDidChangeCursorPosition(updateCursorPosition);
      provider.awareness.on("change", renderRemoteCursors);

      // Clean up the Monaco binding when the editor unmounts
      return () => {
        provider.disconnect();
        doc.destroy();
        binding.destroy();
      };
    }

    return (
      <Stack w={"100%"} h={"50%"}>
        <HStack justifyContent={"space-between"}>
          <Tooltip
            label="Select your preferred language."
            hasArrow
            bg="gray.300"
            color="black"
          >
            <Select
              // placeholder="Whiteboard"
              // defaultValue={language}
              value={userLanguage}
              w={{ lg: "15%", sm: "40%" }}
              variant={"filled"}
              h={"100%"}
              onChange={(e) => {
                setUserLanguage(e.target.value);
              }}
              bg={"#DEE2F5"}
            >
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </Tooltip>
          <ButtonGroup>
            <Tooltip label="Get New Random Question" hasArrow bg={"#706CCC"}>
              <IconButton
                icon={<ArrowForwardIcon />}
                variant={"outline"}
                borderColor={"#DEE2F5"}
                color={"#625AF3"}
                _hover={{
                  bg: "#DEE2F5",
                }}
                isLoading={isGetNextQuestionLoading}
                onClick={initiateNextQuestionRequest}
              />
            </Tooltip>
            <Tooltip label="Reset code" hasArrow bg={"#706CCC"}>
              <IconButton
                icon={<RepeatIcon />}
                variant={"outline"}
                borderColor={"#DEE2F5"}
                color={"#625AF3"}
                _hover={{
                  bg: "#DEE2F5",
                }}
                onClick={resetCode}
              />
            </Tooltip>
          </ButtonGroup>
        </HStack>
        <Editor
          height={"40vh"}
          width={"100%"}
          theme={"vs-dark"}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          language={userLanguage}
          value={code}
          options={options}
        />
        <Flex justifyContent={"space-between"}>
          <Button
            variant={"ghost"}
            onClick={onConsoleOpen}
            _hover={{ bg: "#DEE2F5" }}
          >
            Console
            <ChevronUpIcon />
          </Button>
          <Drawer
            placement={"bottom"}
            onClose={onConsoleClose}
            isOpen={isConsoleOpen}
            size={"md"}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                <Text fontSize={"2xl"} fontWeight={"bold"} color={"#706CCC"}>
                  Testing Console
                </Text>
              </DrawerHeader>
              <DrawerBody minH={"20vh"}>
                <Stack spacing={"2"}>
                  {resultStore.state.stdout ? (
                    <>
                      <Text fontSize={"xl"} color={"#353138"} as={"b"}>
                        Output {}
                      </Text>
                      <Card backgroundColor={"#DEE2F5"} variant={"filled"}>
                        <CardBody>
                          <Text color={"#353138"}>
                            {resultStore.state.stdout}
                          </Text>
                        </CardBody>
                      </Card>
                    </>
                  ) : (
                    <Text fontSize={"xl"} color={"#353138"} as={"b"}>
                      No output generated
                    </Text>
                  )}
                  {resultStore.state.status.id >= 5 &&
                  resultStore.state.status.id <= 14 ? (
                    <>
                      <Divider />
                      <Text as={"b"} fontSize={"xl"} color={"#EC4E4E"}>
                        {resultStore.state.status.description}
                      </Text>
                      {resultStore.state.stderr ? (
                        <Card variant={"filled"} bg={"#F8D0D0"}>
                          <CardBody>
                            <Text color={"#EC4E4E"}>
                              {resultStore.state.stderr}
                            </Text>
                          </CardBody>
                        </Card>
                      ) : (
                        <></>
                      )}
                    </>
                  ) : (
                    <></>
                  )}
                </Stack>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <ButtonGroup>
            <Button
              variant={"outline"}
              color={"#625AF3"}
              borderColor={"#DEE2F5"}
              _hover={{
                bg: "#DEE2F5",
              }}
              isDisabled={isPressed}
              onClick={handleRunButtonClick}
            >
              {isRunLoading ? "Running..." : "Run"}
            </Button>
          </ButtonGroup>
        </Flex>
      </Stack>
    );
  }
);

CodeEditor.propTypes = {
  questionTitle: PropTypes.string,
  roomId: PropTypes.string,
  language: PropTypes.string,
  onLanguageChange: PropTypes.func,
};
