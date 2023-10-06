export const createModalComponentStore = () => {
  return {
    isOpen: false,
    modalTitle: null,
    modalBody: null,
    modalFooter: null,
    onSubmit: () => {},
    openModal(modalTitle, modalBody, modalFooter, submitFunction) {
      // set the content of the modal and then open it
      this.setModalTitle(modalTitle);
      this.setModalBody(modalBody);
      this.setModalFooter(modalFooter);
      this.setOnSubmit(submitFunction);
      this.isOpen = true;
    },
    closeModal() {
      // close the modal then clear all content
      this.isOpen = false;
      this.setModalTitle(null);
      this.setModalBody(null);
      this.setModalFooter(null);
      this.setOnSubmit(() => {});
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
  };
};
