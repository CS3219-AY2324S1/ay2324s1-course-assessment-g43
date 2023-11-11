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
      closeOnEsc={modalComponentStore.isClosable}
      closeOnOverlayClick={modalComponentStore.isClosable}
      isCentered
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <form onSubmit={modalComponentStore.onSubmit}>
        <ModalContent>
          <ModalHeader>{modalComponentStore.modalTitle}</ModalHeader>
          {!modalComponentStore.isClosable ? <></> : <ModalCloseButton />}
          <ModalBody>{modalComponentStore.modalBody}</ModalBody>
          <ModalFooter>{modalComponentStore.modalFooter}</ModalFooter>
        </ModalContent>
      </form>
    </Modal>
  );
});

export default ModalComponent;
