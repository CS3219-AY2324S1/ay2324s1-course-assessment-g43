import React, { createContext, useContext } from "react";
import { createModalComponentStore } from "../stores/ModalComponentStore";
import { useLocalObservable } from "mobx-react";

const ModalComponentContext = createContext(null);

export const ModalComponentProvider = ({ children }) => {
  const modalComponentStore = useLocalObservable(createModalComponentStore);

  return (
    <ModalComponentContext.Provider value={modalComponentStore}>
      {children}
    </ModalComponentContext.Provider>
  );
};
export const useModalComponentStore = () => useContext(ModalComponentContext);
