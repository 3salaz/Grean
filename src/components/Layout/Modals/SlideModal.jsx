import { motion } from "framer-motion";
import Button from "../Button";

const SlideModal = ({ isOpen, handleClose, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-2 left-0 right-0 z-20 bg-grean shadow-lg rounded-t-lg p-2 pb-6"
    >
      <div className="flex flex-col items-center justify-start gap-2 p-2 bg-white rounded-md min-h-[60svh]">
        {children}
        <Button
          variant="alert"
          size="medium"
          onClick={handleClose}
        >
          Close
        </Button>
      </div>
    </motion.div>
  );
};

export default SlideModal;

