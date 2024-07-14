// SpringModal.js
import { motion } from "framer-motion";
import Button from "../Button";

const SpringModal = ({ isOpen, handleClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed h-screen inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="bg-green-600 rounded-lg p-4 max-w-lg w-full h-[650px] max-h-[650px] overflow-auto
        "
      >
        <div className="flex h-[90%]  flex-col items-center justify-start gap-4 p-4 bg-white drop-shadow-lg rounded-md">
          {children}
          <div className="h-[10%] flex items-center justify-center">
          <Button variant="alert" size="medium" onClick={handleClose}>
            Close
          </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SpringModal;
