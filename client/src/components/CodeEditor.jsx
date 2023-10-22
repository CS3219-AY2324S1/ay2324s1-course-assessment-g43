import { Card, CardHeader, CardBody, Divider, Select } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

export const CodeEditor = () => {
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

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
    //Init YJS
    const doc = new Y.Doc(); //collection of shared objects
    //Connect to peers with WebRTC, diff rooms for diff sessions
    const provider = new WebrtcProvider("test-room", doc);
    const type = doc.getText("monaco");
    //Bind YJS to monaco
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness, binding);
  }

  const [language, setLanguage] = useState("python");
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
        break;
    }
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
        return "";
    }
  };

  return (
    <Card>
      <CardHeader>
        <Select
          placeholder="Python"
          w={{ base: "20%", sm: "40%" }}
          variant={"filled"}
          h={"10%"}
          onChange={(e) => {
            console.log(e.target.value);
            handleLanguageChange(e.target.value);
          }}
        >
          <option>Java</option>
          <option>C++</option>
          <option>Javascript</option>
        </Select>
      </CardHeader>
      <Divider color="gray.300" />
      <CardBody>
        <Editor
          height={"40vh"}
          width={"100%"}
          theme={"vs-dark"}
          onMount={handleEditorDidMount}
          onChange={handleEditorChange}
          language={language}
          value={code}
          options={options}
        />
      </CardBody>
    </Card>
  );
};
