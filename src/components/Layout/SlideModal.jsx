import { motion } from "framer-motion";
import Button from "./Button";

const SlideModal = ({ isOpen, handleClose, children }) => {
  return (
    <motion.div
      initial={{ y: "90%" }}
      animate={{ y: isOpen ? 0 : "110%" }}
      exit={{ y: "90%" }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-[10svh] left-0 right-0 z-20 bg-grean shadow-lg rounded-t-lg p-2 pb-6"
    >
      <div className="flex flex-col items-center justify-between gap-2 p-2 bg-white rounded-md min-h-[60svh]">
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
