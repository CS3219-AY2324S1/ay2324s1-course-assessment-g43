import { createContext, useContext } from "react";
import { PropTypes } from "prop-types";
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

ModalComponentProvider.propTypes = {
  children: PropTypes.object,
};

export const useModalComponentStore = () => useContext(ModalComponentContext);
