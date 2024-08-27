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
      className="fixed top-[0svh] right-0 left-0 z-50 bg-grean bg-opacity-15 w-full rounded-t-lg mx-auto h-full flex items-center justify-center"
    >
      <div className="flex flex-col items-center justify-center bg-white drop-shadow-lg rounded-md min-h-[60svh] h-full md:h-[90%] container w-full">
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

