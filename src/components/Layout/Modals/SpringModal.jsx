// SpringModal.js
import { motion } from "framer-motion";
import Button from "../Button";

const SpringModal = ({
  isOpen,
  handleClose,
  children,
  showCloseButton = true,
}) => {
  if (!isOpen) return null;

  return (
    <div id="springModalBackground" className="fixed h-screen w-full inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    >
      <motion.div
        id="springModalContainer"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0 }}
        transition={{ type: "spring", stiffness: 150, damping: 20 }}
        className="flex flex-col justify-center items-center bg-green-600 rounded-lg p-4 max-w-lg w-full max-h-[650px]  min-h-[500px]
        "
      >
        <div
          id="springModal"
          className="flex w-full h-full flex-col gap-2 items-center justify-start rounded-md bg-white shadow-lg p-4"
        >
          {children}
          {showCloseButton && (
            <section id="modalCloseSection" className="flex items-center justify-center">
              <Button id="modalClose" variant="alert" size="medium" onClick={handleClose}>
                Close
              </Button>
            </section>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default SpringModal;
