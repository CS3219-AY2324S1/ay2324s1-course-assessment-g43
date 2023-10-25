import {
  Stack,
  Divider,
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
} from "@chakra-ui/react";
import { ChevronUpIcon, RepeatIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { observer } from "mobx-react";
import { WebsocketProvider } from "y-websocket";
import { MonacoBinding } from "y-monaco";
import { PropTypes } from "prop-types";

/**
 * `language` prop changes when PEER changes language
 * `onLanguageChange` is a callback function called when USER changes language
 */
export const CodeEditor = observer(
  ({ questionTitle, roomId, language, onLanguageChange }) => {
    const WS_SERVER_URL = "ws://localhost:8002";
    const editorRef = useRef(null);
    const [userLanguage, setUserLanguage] = useState(language);
    const [code, setCode] = useState("");
    const [isDisabled, setDisability] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
      // TODO: Debug this -- why doesn't monaco initialise with the template code?
      const template = getCodeTemplate(language, questionTitle);
      setCode(template);

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
      if (
        confirm("Changing languages will erase any current code! Are you sure?")
      ) {
        setCode(getCodeTemplate(userLanguage.toLowerCase(), questionTitle));
        onLanguageChange(userLanguage); // Notify peer
      }

      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLanguage]);

    useEffect(() => {
      // This changes when PEER changes language
      // console.log("PEER changed language changed to: ", language);
      if (language === userLanguage) return;
      setUserLanguage(language);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [language]);

    useEffect(() => {
      userLanguage == "text" ? setDisability(true) : setDisability(false);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userLanguage, isDisabled]);

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
          return `class Solution {\npublic:\n\t// change your function type below if necessary\n\tvoid ${functionName}(/*define your params here*/){\n\t\t\n\t};\n}`;
        case "java":
          setDisability(false);
          return `class Solution {\n\t// change your function type below if necessary\n\tpublic static void ${functionName}(/*define your params here*/) {\n\t\t\n\t}\n}\n`;
        case "python":
          setDisability(false);
          return `class Solution:\n\tdef ${functionName}():\n\t\treturn\n`;
        case "javascript":
          setDisability(false);
          return `const ${functionName} = (/*define your params here*/) => {\n\treturn;\n}`;
        case "text":
          setDisability(true);
          return ``;
        default:
          setDisability(true);
          return ``;
      }
    }, []);

    const resetCode = () => {
      if (
        confirm(
          "Are you sure? Your current code will be discarded and reset to the default code!"
        )
      ) {
        setCode(getCodeTemplate(userLanguage.toLowerCase(), questionTitle));
      }
    };

    const handleEditorChange = (currContent) => {
      if (!currContent) return;
      setCode(currContent);
    };

    function getEditorValue() {
      console.log(editorRef.current.getValue());
      return alert(editorRef.current.getValue());
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

    return (
      <Stack w={"100%"} h={"100%"}>
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
            >
              <option value="text">Whiteboard</option>
              <option value="python">Python</option>
              <option value="java">Java</option>
              <option value="cpp">C++</option>
              <option value="javascript">JavaScript</option>
            </Select>
          </Tooltip>
          <Tooltip label="Reset code" hasArrow bg="gray.300" color="black">
            <IconButton
              icon={<RepeatIcon />}
              variant={"unstyled"}
              onClick={resetCode}
            />
          </Tooltip>
        </HStack>
        <Divider color="gray.300" />
        <Editor
          height={"70vh"}
          width={"100%"}
          theme={"vs-dark"}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          language={userLanguage}
          value={code}
          options={options}
        />
        <Divider />
        <Flex justifyContent={"space-between"}>
          <Button variant={"ghost"} onClick={onOpen}>
            Console
            <ChevronUpIcon />
          </Button>
          <Drawer
            placement={"bottom"}
            onClose={onClose}
            isOpen={isOpen}
            size={"md"}
          >
            <DrawerOverlay />
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">
                Console for testing
              </DrawerHeader>
              <DrawerBody>
                <p>Could be a popup instead, up to whatever we think is nice</p>
                <p>I dont think I can replicate leetcode entirely...</p>
                <p>
                  Any ideas to have what leetcode has will be greatly
                  appreciated!!
                </p>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <ButtonGroup>
            <Button
              variant={"outline"}
              isDisabled={isDisabled}
              onClick={getEditorValue}
            >
              Run
            </Button>
            <Button
              variant={"solid"}
              color={"green"}
              isDisabled={isDisabled}
              onClick={getEditorValue}
            >
              Submit
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
