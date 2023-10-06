export const createModalComponentStore = () => {
  return {
    isOpen: false,
    openModal() {
      this.isOpen = true;
    },
    closeModal() {
      this.isOpen = false;
    },
  };
};
