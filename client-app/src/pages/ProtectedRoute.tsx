import { ReactNode, useEffect } from "react";
import { useHistory } from "react-router-dom"; // ✅ Use `useHistory` for v5
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loadingAuth } = useAuth();
  const history = useHistory(); // ✅ Correct hook for v5

  // ✅ Redirect only after authentication check completes
  useEffect(() => {
    if (!loadingAuth && !user) {
      history.replace("/"); // Prevents back navigation
    }
  }, [user, loadingAuth, history]);

  return (
    <AnimatePresence>
      {loadingAuth ? (
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
        user ? children : null // ✅ Render children only if authenticated
      )}
    </AnimatePresence>
  );
};

export default ProtectedRoute;
