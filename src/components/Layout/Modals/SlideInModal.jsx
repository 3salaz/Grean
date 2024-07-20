import { motion } from "framer-motion";
import Button from "../Button";

const SlideInModal = ({ isOpen, handleClose, children, showCloseButton = true }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed h-screen w-full inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70">
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '-100%' }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex items-center justify-center bg-green-600 rounded-lg p-4 max-w-lg w-full max-h-full min-h-full overflow-auto"
      >
        <div className="flex flex-col items-center justify-center gap-2 p-4 bg-white drop-shadow-xl rounded-md min-h-[500px] w-full">
          {children}
          {showCloseButton && (
            <div className="flex items-center justify-center">
              <Button variant="alert" size="medium" onClick={handleClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SlideInModal;
