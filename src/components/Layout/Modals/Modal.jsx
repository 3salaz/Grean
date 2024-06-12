import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../Button";

const Modal = ({ isOpen, handleClose, width, height, bgColor, borderColor, children }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className={`fixed inset-0 flex items-center justify-center z-30 container mx-auto px-4`}
        onClick={handleClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div className={`p-4 w-full flex flex-col gap-2 items-center bg-white drop-shadow-2xl rounded-md`}
          onClick={(e) => e.stopPropagation()}
          initial={{ y: "200vh" }}
          animate={{ y: "0" }}
          exit={{ y: "100vh" }}
        >
          {children}
          <Button onClick={handleClose} variant="alert" size="medium" shape="rounded">
            Close
          </Button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default Modal;
