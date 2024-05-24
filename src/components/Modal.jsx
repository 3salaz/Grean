import React from "react";
import { motion } from "framer-motion";

const Modal = ({ isOpen, handleClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      id="modal"
      className="absolute w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-lg w-full flex flex-col items-center justify-center h-full border-grean border-4 max-w-[600px]"
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          {children}
          <div className="h-[8%] flex items-center justify-center w-full">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-red-500 text-white px-2 p-1 rounded-md w-40"
              onClick={handleClose}
            >
              Close
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
