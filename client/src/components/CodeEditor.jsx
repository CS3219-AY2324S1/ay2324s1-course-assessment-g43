import { Stack, Divider, Select } from "@chakra-ui/react";
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
      setCode(getCodeTemplate(userLanguage.toLowerCase(), questionTitle));
      onLanguageChange(userLanguage); // Notify peer
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
          return `class Solution {\npublic:\n\t// change your function type below if necessary\n\tvoid ${functionName}(/*define your params here*/){\n\t\t\n\t};\n}`;
        case "java":
          return `class Solution {\n\t// change your function type below if necessary\n\tpublic static void ${functionName}(/*define your params here*/) {\n\t\t\n\t}\n}\n`;
        case "python":
          return `class Solution:\n\tdef ${functionName}():\n\t\treturn\n`;
        case "javascript":
          return `const ${functionName} = (/*define your params here*/) => {\n\treturn;\n}`;
        default:
          return `Select your preferred language.`;
      }
    }, []);

    const handleEditorChange = (currContent) => {
      if (!currContent) return;
      setCode(currContent);
    };

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
        <Select
          // placeholder="Select Language"
          // defaultValue={language}
          value={userLanguage}
          w={{ lg: "15%", sm: "20%" }}
          variant={"filled"}
          h={"100%"}
          onChange={(e) => {
            setUserLanguage(e.target.value);
          }}
        >
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="javascript">JavaScript</option>
        </Select>
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
