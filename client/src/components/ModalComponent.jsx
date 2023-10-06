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
      <ModalContent>
        <ModalHeader>{modalComponentStore.modalTitle}</ModalHeader>
        <ModalCloseButton />
        <form>
          <ModalBody>{modalComponentStore.modalBody}</ModalBody>

          <ModalFooter>{modalComponentStore.modalFooter}</ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

export default ModalComponent;
