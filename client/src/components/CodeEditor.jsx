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
import { createSubmissionStore } from "../stores/createSubmissionStore";
import { getSubmissionResultStore } from "../stores/getSubmissionResultStore";

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
    const [isDisabled, setDisability] = useState(true);
    const { isOpen, onOpen, onClose } = useDisclosure();
    const store = createSubmissionStore;
    const resultStore = getSubmissionResultStore;
    const [isRunLoading, setRunLoading] = useState(false);
    const [isSubmitLoading, setSubmitLoading] = useState(false);
    const [isPressed, setPressed] = useState(false);

    useEffect(() => {
      // TODO: Debug this -- why doesn't monaco initialise with the template code?
      const template = getCodeTemplate(language, questionTitle);
      setCode(template);
      store.setSourceCode(code);

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
        const newCode = getCodeTemplate(userLanguage.toLowerCase(), questionTitle);
        setCode(newCode);
        store.setSourceCode(newCode);
    
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
          store.setLanguageId(0); //shouldn't set? because by right submit/run button will be invalid right?
          return `Use this space for working.`;
        default:
          setDisability(true);
          store.setLanguageId(0); //shouldn't set? because by right submit/run button will be invalid right?
          return ``;
      }
    }, []);

    const resetCode = () => {
      if (
        confirm(
          "Are you sure? Your current code will be discarded and reset to the default code!"
        )
      ) {
        const newCode = getCodeTemplate(userLanguage.toLowerCase(), questionTitle);
        setCode(newCode);
        store.setSourceCode(newCode);
      };
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
        // Delay for 2 seconds to avoid rate limit (2000 milliseconds)
      setTimeout(async () => {
        const result = await resultStore.getSubmissionResult();
        console.log(result);
        // alert("Code Executed!");
      }, 2000); // 2000 milliseconds (2 seconds)
        // alert(editorRef.current.getValue());
      } catch (error) {
        console.error(error);
      }
    }
    
    function delayForFiveSeconds() {
      return new Promise((resolve) => {
        setTimeout(resolve, 5000); // 5000 milliseconds = 5 seconds
      });
    }

    async function handleRunButtonClick() {
      setPressed(true);
      setRunLoading(true);    
      try {
        // await getEditorValue();
        // Call the function to set the timeout
        await delayForFiveSeconds();   
      } catch (error) {
        // Handle errors here
        console.error(error);
      } finally {
        setPressed(false);
        setRunLoading(false);
      }
    }
    
    async function handleSubmitButtonClick() {
      setPressed(true);
      setSubmitLoading(true);
      try {
        // await getEditorValue();
        // Call the function to set the timeout
        await delayForFiveSeconds();   
      } catch (error) {
        // Handle errors here
        console.error(error);
      } finally {
        setPressed(false);
        setSubmitLoading(false);
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
                <p>Status: {resultStore.state.status}</p>
                <p>Stdout: {resultStore.state.stdout}</p>
                <p style={{ color: 'red' }}>Stderr: {resultStore.state.stderr}</p>
              </DrawerBody>
            </DrawerContent>
          </Drawer>
          <ButtonGroup>
            <Button
              variant={"outline"}
              isDisabled={isDisabled || isPressed}
              onClick={handleRunButtonClick}
            >
              {isRunLoading ? 'Running...' : 'Run'}
            </Button>
            <Button
              variant={"solid"}
              color={"green"}
              isDisabled={isDisabled || isPressed}
              onClick={handleSubmitButtonClick}
            >
              {/* {isSubmitLoading  ? 'Submitting...' : 'Submit'} */}
              {isDisabled ? 'Disabled' : (isSubmitLoading ? 'Submitting...' : 'Submit')}
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
