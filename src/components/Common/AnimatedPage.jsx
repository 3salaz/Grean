import { motion } from "framer-motion";

const AnimatedPage = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, x: -200 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: 200 }}
    transition={{ duration: 0.5 }}
  >
    {children}
  </motion.div>
);

export default AnimatedPage;

