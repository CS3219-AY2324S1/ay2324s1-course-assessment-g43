import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Tooltip,
} from "@chakra-ui/react";

import { observer } from "mobx-react";
import { useEffect } from "react";

const ResumeSession = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <Modal
      closeOnOverlayClick={false}
      isOpen={isOpen}
      closeOnEsc={false}
      isCentered
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Resume session</ModalHeader>
        <ModalBody pb={6}>
          It seems that you have an active session, please resume the session.
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="green" onClick={onClose}>
            Resume
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default ResumeSession;
