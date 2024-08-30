import { useHistory } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthProfile } from '../context/AuthProfileContext';

function ProtectedRoute({ children }) {
  const { user, loading } = useAuthProfile();
  const history = useHistory();

  return (
    <AnimatePresence>
      {loading ? (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center bg-white h-[80%] mt-[8svh]"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="text-center text-white font-bold aspect-square bg-grean rounded-full flex items-center justify-center p-4"
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            Loading...
          </motion.div>
        </motion.div>
      ) : (
        !user ? (
          history.push("/")
        ) : (
          children
        )
      )}
    </AnimatePresence>
  );
}

export default ProtectedRoute;
