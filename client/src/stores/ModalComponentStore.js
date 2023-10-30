export const createModalComponentStore = () => {
  return {
    isOpen: false,
    isClosable: true,
    modalTitle: null,
    modalBody: null,
    modalFooter: null,
    onSubmit: () => {},
    resetContentState: () => {},
    openModal(
      modalTitle,
      modalBody,
      modalFooter,
      submitFunction,
      resetContentStateFunction
    ) {
      // set the content of the modal and then open it
      this.setModalTitle(modalTitle);
      this.setModalBody(modalBody);
      this.setModalFooter(modalFooter);
      this.setOnSubmit(submitFunction);
      this.setResetContentState(resetContentStateFunction);
      this.isOpen = true;
    },
    closeModal() {
      // close the modal then clear all content
      this.resetContentState?.();
      this.isOpen = false;
      this.isClosable = true;
      this.setModalTitle(null);
      this.setModalBody(null);
      this.setModalFooter(null);
      this.setOnSubmit(() => {});
      this.setResetContentState(() => {});
    },
    setClosable(closable) {
      this.isClosable = closable;
    },
    setModalTitle(content) {
      this.modalTitle = content;
    },
    setModalBody(content) {
      this.modalBody = content;
    },
    setModalFooter(content) {
      this.modalFooter = content;
    },
    setOnSubmit(submitFunction) {
      this.onSubmit = submitFunction;
    },
    setResetContentState(resetContentStateFunction) {
      this.resetContentState = resetContentStateFunction;
    },
  };
};
