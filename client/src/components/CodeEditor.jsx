import { Button, HStack, Stack } from "@chakra-ui/react";
import { useRef, useState } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

const files = {
  "script.py": {
    name: "script.py",
    language: "python",
    value: "print('Hello world')",
  },
  "index.html": {
    name: "index.html",
    language: "html",
    value: "<div>hello world </div>",
  },
  "script.js": {
    name: "script.js",
    language: "javascript",
    value: "let name = 5",
  },
};

export const CodeEditor = () => {
  const editorRef = useRef(null);

  function handleEditorDidMount(editor, monaco) {
    editorRef.current = editor;
    //Init YJS
    const doc = new Y.Doc(); //collection of shared objects
    //Connect to peers with WebRTC
    const provider = new WebrtcProvider("test-room", doc);
    const type = doc.getText("monaco");
    //Bind YJS to monaco
    const binding = new MonacoBinding(
      type,
      editorRef.current.getModel(),
      new Set([editorRef.current]),
      provider.awareness
    );
    console.log(provider.awareness);
  }

  function getEditorValue() {
    alert(editorRef.current.getValue());
  }

  const [fileName, setFileName] = useState("script.py");
  const file = files[fileName];

  return (
    <Stack align={"center"}>
      <HStack>
        <Button onClick={() => setFileName("script.py")}>
          Switch to script.py
        </Button>
        <Button onClick={() => setFileName("index.html")}>
          Switch to index.html
        </Button>
        <Button onClick={() => setFileName("script.js")}>
          Switch to script.js
        </Button>
        <Button onClick={() => getEditorValue()}>Get Editor Value</Button>
      </HStack>
      <Editor
        height={"50vh"}
        width={"90vw"}
        theme={"vs-dark"}
        onMount={handleEditorDidMount}
        path={file.name}
        defaultLanguage={file.language}
        defaultValue={file.value}
      />
    </Stack>
  );
};
