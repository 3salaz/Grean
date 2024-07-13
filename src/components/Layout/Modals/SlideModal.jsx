import { motion } from "framer-motion";
import Button from "../Button";

const SlideModal = ({ isOpen, handleClose, children }) => {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ y: "100%" }}
      animate={{ y: 0 }}
      exit={{ y: "100%" }}
      transition={{ type: "spring", stiffness: 300, damping: 40 }}
      className="fixed bottom-[10svh] container right-0 left-0 z-20 bg-grean rounded-t-lg p-2 max-w-[650px] mx-auto "
    >
      <div className="flex flex-col items-center justify-start gap-2 p-2 pb-4 bg-white drop-shadow-lg rounded-md min-h-[60svh]">
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

