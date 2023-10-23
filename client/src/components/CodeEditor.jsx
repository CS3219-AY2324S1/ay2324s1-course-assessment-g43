import { Stack, Divider, Select } from "@chakra-ui/react";
import { viewSessionStore } from "../stores/viewSessionStore";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebsocketProvider } from 'y-websocket';
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";
import { PropTypes } from "prop-types";

export const CodeEditor = ({ questionTitle, roomId }) => {
  const store = viewSessionStore;

  const editorRef = useRef(null);

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

  const getCodeTemplate = (lang, questionTitle) => {
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
  };

  const [language, setLanguage] = useState("");
  const [code, setCode] = useState(getCodeTemplate(language, ""));

  const handleEditorChange = (currContent) => {
    if (!currContent) return;
    setCode(currContent);
  };

  const handleLanguageChange = (lang, questionTitle) => {
    switch (lang) {
      case "C++":
        setLanguage("cpp");
        setCode(getCodeTemplate("cpp", questionTitle));
        break;
      case "Java":
        setLanguage("java");
        setCode(getCodeTemplate("java", questionTitle));
        break;
      case "Python":
        setLanguage("python");
        setCode(getCodeTemplate("python", questionTitle));
        break;
      case "Javascript":
        setLanguage("javascript");
        setCode(getCodeTemplate("javascript", questionTitle));
        break;
      default:
        setLanguage("text");
        setCode(getCodeTemplate("text", questionTitle));
        break;
    }
  };

  // eslint-disable-next-line no-unused-vars
  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    //Init YJS
    const doc = new Y.Doc(); //collection of shared objects
    //Connect to peers with WebRTC, diff rooms for diff sessions
    // const provider = new WebrtcProvider("1698042045-18-19", doc, );
    const serverWsUrl = "ws://localhost:1234";
    const realRoomId = roomId;
    // console.log("room id is");
    // console.log(roomId);

    const provider = new WebsocketProvider(serverWsUrl, realRoomId, doc);

    const type = doc.getText("monaco");
    //Bind YJS to monaco
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );

    console.log(editorRef);
    console.log(provider.awareness, binding);
  }



  return (
    <Stack w={"100%"} h={"100%"}>
      <Select
        placeholder="Select Language"
        w={{ lg: "15%", sm: "20%" }}
        variant={"filled"}
        h={"100%"}
        onChange={(e) => {
          handleLanguageChange(e.target.value, questionTitle);
        }}
      >
        <option>Python</option>
        <option>Java</option>
        <option>C++</option>
        <option>Javascript</option>
      </Select>
      <Divider color="gray.300" />
      <Editor
        height={"70vh"}
        width={"100%"}
        theme={"vs-dark"}
        onMount={handleEditorDidMount}
        onChange={handleEditorChange}
        language={language}
        value={code}
        options={options}
      />
    </Stack>
  );
};

CodeEditor.propTypes = {
  questionTitle: PropTypes.string,
  roomId: PropTypes.string,
  split: PropTypes.object,
};
