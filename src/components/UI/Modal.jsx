import { motion } from "framer-motion";
import Button from "./Button";

const Modal = ({ 
  isOpen, 
  handleClose, 
  children, 
  width = "max-w-[600px]", 
  height = "h-full", 
  bgColor = "bg-white", 
  borderColor = "border-grean",
  showCloseButton = true,
  closeButtonClassName = "bg-red-500 text-white px-2 p-1 rounded-md w-40",
  closeButtonText = "Close"
}) => {
  if (!isOpen) return null;

  const dropIn = {
    hidden: {
      y: "-100vh",
      opacity: 0,
    },
    visible: {
      y: "0",
      opacity: 1,
      transition: {
        duration: 0.1,
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      y: "100vh",
      opacity: 0,
    },
  };

  return (
    <div
      id="modal"
      className="fixed w-full inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-6"
    >
      <motion.div
        variants={dropIn}
        initial="hidden"
        animate="visible"
        exit="exit"
        className={`${bgColor} rounded-lg w-full flex flex-col items-center justify-center ${height} ${width} border-4 ${borderColor} drop-shadow-2xl`}
      >
        <div className="w-full h-full flex flex-col items-center justify-center">
          {children}
          {showCloseButton && (
            <div className="h-[8%] flex items-center justify-center w-full">
              <Button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                variant="alert"
                size="medium"
                onClick={handleClose}
              >
                {closeButtonText}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Modal;
