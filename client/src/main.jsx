import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ChakraProvider } from "@chakra-ui/react";
import { ModalComponentProvider } from "./contextProviders/modalContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <ChakraProvider>
    <ModalComponentProvider>
      <App />
    </ModalComponentProvider>
  </ChakraProvider>
  // </React.StrictMode>
);
