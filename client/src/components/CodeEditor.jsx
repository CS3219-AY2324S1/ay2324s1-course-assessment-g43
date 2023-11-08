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
    questionTitle,
    roomId,
    language,
    onLanguageChange,
    isGetNextQuestionLoading,
  }) => {
    const WS_SERVER_URL = "ws://localhost:8002";
    const editorRef = useRef(null);
    const [userLanguage, setUserLanguage] = useState(language);
    const [code, setCode] = useState("");
    const [isDisabled, setDisability] = useState(true);
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
      // TODO: Debug this -- why doesn't monaco initialise with the template code?
      const template = getCodeTemplate(language, questionTitle);
      setCode(template);
      store.setSourceCode(template);

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // !DEBUG
    // useEffect(() => {
    //   if (!code) return;
    //   console.log("Code changed: ", code);
    // }, [code]);

    useEffect(() => {
      // This changes when USER changes language
      // console.log("userLanguage changed to: ", userLanguage);
      if (!userLanguage || userLanguage === language) return;

      const newCode = getCodeTemplate(
        userLanguage.toLowerCase(),
        questionTitle
      );
      setCode(newCode);
      store.setSourceCode(newCode);

      onLanguageChange(userLanguage); // Notify peer

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLanguage]);

    useEffect(() => {
      // This changes when PEER changes language
      // console.log("PEER changed language changed to: ", language);
      if (language === userLanguage) return;
      setUserLanguage(language);
      if (language == "text") {
        setDisability(true);
      } else {
        setDisability(false);
      }
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

    const convertTitleToFunctionName = (questionTitle) => {
      const words = questionTitle.split(" ");
      let formatted = "";
      words.forEach((word, index) => {
        if (index > 0) {
          formatted += word[0].toUpperCase() + word.slice(1).toLowerCase();
        } else {
          formatted = word.toLowerCase();
        }
      });
      return formatted;
    };

    const getCodeTemplate = useCallback((lang, questionTitle) => {
      const functionName = convertTitleToFunctionName(questionTitle);
      switch (lang) {
        case "cpp":
          setDisability(false);
          store.setLanguageId(54);
          return `class Solution {\npublic:\n\t// change your function type below if necessary\n\tvoid ${functionName}(/*define your params here*/){\n\t\t\n\t};\n}`;
        case "java":
          setDisability(false);
          store.setLanguageId(62);
          return `class Solution {\n\t// change your function type below if necessary\n\tpublic static void ${functionName}(/*define your params here*/) {\n\t\t\n\t}\n}\n`;
        case "python":
          setDisability(false);
          store.setLanguageId(71);
          return `class Solution:\n\tdef ${functionName}():\n\t\treturn\n`;
        case "javascript":
          setDisability(false);
          store.setLanguageId(93);
          return `const ${functionName} = (/*define your params here*/) => {\n\treturn;\n}`;
        case "text":
          setDisability(true);
          return ``;
        default:
          setDisability(true);
          return ``;
      }
    }, []);

    const initiateNextQuestionRequest = () => {
      viewSessionStore.initChangeQuestion();
      viewSessionStore.setIsGetQuestionLoading(true);
    };

    const resetCode = () => {
      if (
        confirm(
          "Are you sure? Your current code will be discarded and reset to the default code!"
        )
      ) {
        const newCode = getCodeTemplate(
          userLanguage.toLowerCase(),
          questionTitle
        );
        setCode(newCode);
        store.setSourceCode(newCode);
      }
    };

    const handleEditorChange = (currContent) => {
      if (!currContent) return;
      setCode(currContent);
      store.setSourceCode(currContent);
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
      // Bind YJS to monaco
      // eslint-disable-next-line no-unused-vars
      const binding = new MonacoBinding(
        type,
        editorRef.current.getModel(),
        new Set([editorRef.current]),
        provider.awareness
      );

      // console.log(editorRef);
      // console.log(provider.awareness, binding);
    }
    // console.log(isDisabled);

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
                confirm(
                  "Changing languages will erase any current code! Are you sure?"
                )
                  ? setUserLanguage(e.target.value)
                  : {};
              }}
              bg={"#DEE2F5"}
            >
              <option value="text">Notes</option>
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
              isDisabled={isDisabled || isPressed}
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
