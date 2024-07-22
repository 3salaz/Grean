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
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="flex flex-col justify-center items-center bg-green-600 rounded-lg p-4 max-w-lg w-full max-h-[650px]  min-h-[500px] overflow-auto
        "
      >
        <div
          id="springModal"
          className="flex w-full h-full flex-col gap-2 items-center justify-start p-4 rounded-md bg-white shadow-lg"
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
