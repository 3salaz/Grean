import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const Modal = ({ isOpen, handleClose, width, height, bgColor, borderColor, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 flex items-center justify-center z-50`}
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={`relative p-4 ${bgColor} ${borderColor} ${width} ${height}`}
          onClick={(e) => e.stopPropagation()}
          initial={{ y: "-100vh" }}
          animate={{ y: "0" }}
          exit={{ y: "100vh" }}
        >
          <button
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            onClick={handleClose}
          >
            &times;
          </button>
          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
