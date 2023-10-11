import { useRef } from "react";
import { Editor } from "@monaco-editor/react";
import * as Y from "yjs";
import { WebrtcProvider } from "y-webrtc";
import { MonacoBinding } from "y-monaco";

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

  return (
    <Editor
      height={"50vh"}
      width={"90vw"}
      theme={"vs-dark"}
      onMount={handleEditorDidMount}
    />
  );
};
