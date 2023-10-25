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

const ResumeSession = observer(() => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Open Modal</Button>

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
            It seems that you have an active session. Do you want to resume the
            session?
          </ModalBody>

          <ModalFooter>
            <Tooltip hasArrow label="Leave Session">
              <Button colorScheme="red" variant="outline" onClick={onClose}>
                Leave
              </Button>
            </Tooltip>
            <Tooltip hasArrow label="Resume Session">
              <Button colorScheme="green" onClick={onClose}>
                Resume
              </Button>
            </Tooltip>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
});

export default ResumeSession;
