import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  FormControl,
  FormLabel,
  Select,
  Button,
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
        <ModalHeader>Find Match</ModalHeader>
        <ModalCloseButton />
        <form>
          <ModalBody>
            <FormControl id="complexity" isRequired>
              <FormLabel>Complexity</FormLabel>
              <Select placeholder="Select complexity">
                <option>Easy</option>
                <option>Medium</option>
                <option>Hard</option>
              </Select>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={modalComponentStore.closeModal}
            >
              Match
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  );
});

export default ModalComponent;
