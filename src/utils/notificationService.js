// src/utils/notificationService.js
import { toast } from 'react-toastify';

export const notifySuccess = (message) => {
  toast.success(message, {
    position: "top-right",
    autoClose: 3000, // Time in ms before the toast disappears
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};

export const notifyError = (message) => {
  toast.error(message, {
    position: "top-right",
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
  });
};
