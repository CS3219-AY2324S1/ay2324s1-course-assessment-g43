import { Stack, CardHeader, CardBody, Divider, Select } from "@chakra-ui/react";
import { useRef, useState, useEffect } from "react";
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

  const [code, setCode] = useState("");
  const [file, setFile] = useState();
  const [language, setLanguage] = useState("python");

  const handleLanguageChange = (language) => {
    if (language == "Python") {
      setLanguage("python");
    } else if (language == "Java") {
      setLanguage("javascript");
    } else {
      setLanguage("cpp");
    }
  };

  const handleFileChange = (event) => {
    if (event.target.files) {
      setFile(event.target.files[0]);
    }
  };

  useEffect(() => {
    if (file) {
      var reader = new FileReader();
      reader.onload = async (e) => {
        setCode(e.target.result);
      };
      reader.readAsText(file);
      let newLanguage = "javascript"; //default is javascript
      const extension = file.name.split(".").pop();
      // python language name diff from extension name
      if (extension == "py") {
        newLanguage = "python";
      } else if (["cpp", "css", "html"].includes(extension)) {
        // can add on other languages next time
        newLanguage = extension;
      }
      setLanguage(newLanguage);
    }
  }, [file]);

  return (
    <>
      <CardHeader>
        <Select
          placeholder="Python"
          w={{ base: "20%", sm: "40%" }}
          variant={"filled"}
          h={"10%"}
          onChange={(e) => {
            handleLanguageChange(e);
          }}
        >
          <option>Java</option>
          <option>C++</option>
        </Select>
      </CardHeader>
      <Divider color="gray.300" />
      <CardBody>
        <Stack align={"center"}>
          <div>
            <input type="file" onChange={handleFileChange} />
          </div>
          <Editor
            height={"50vh"}
            width={"100%"}
            theme={"vs-dark"}
            onMount={handleEditorDidMount}
            language={language}
            value={code}
            options={options}
          />
        </Stack>
      </CardBody>
    </>
  );
};
