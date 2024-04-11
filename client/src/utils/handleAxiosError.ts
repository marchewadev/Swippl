import { AxiosError } from "axios";
import { useModalStore } from "../stores/ModalStore";

export const handleAxiosError = (err: unknown) => {
  if (err instanceof AxiosError) {
    const modalStore = useModalStore();
    modalStore.displayMessageModal(err.response?.data.message, true);
  } else {
    console.error(err);
  }
};
