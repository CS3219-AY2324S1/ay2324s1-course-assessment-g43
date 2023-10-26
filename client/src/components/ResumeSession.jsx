import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";

import { observer } from "mobx-react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ResumeSession = observer(() => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleResumeSession = () => {
    const roomId = localStorage.getItem("roomId");
    navigate("/session/" + roomId);
  };

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
          <Button colorScheme="green" onClick={handleResumeSession}>
            Resume
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
});

export default ResumeSession;
