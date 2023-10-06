import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
} from "@chakra-ui/react";
import { observer } from "mobx-react";
import { useModalComponentStore } from "../contextProviders/modalContext";

const ModalComponent = observer(() => {
  const modalComponentStore = useModalComponentStore();

  return (
    <Modal
      isOpen={modalComponentStore.isOpen}
      onClose={modalComponentStore.closeModal}
      isCentered
    >
      <ModalOverlay />
      <form onSubmit={modalComponentStore.onSubmit}>
        <ModalContent>
          <ModalHeader>{modalComponentStore.modalTitle}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{modalComponentStore.modalBody}</ModalBody>
          <ModalFooter>{modalComponentStore.modalFooter}</ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
});

export default ModalComponent;
