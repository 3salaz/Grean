import React, { ReactNode, useEffect } from "react";
import { Route, Redirect, RouteProps, useHistory } from "react-router-dom"; // ✅ v5 imports
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "@/context/AuthContext";

interface ProtectedRouteProps extends RouteProps {
  /** A React component to render if authorized */
  component?: React.ComponentType<any>;
  /** Optional fallback content if user not authorized */
  children?: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
  children,
  ...rest
}) => {
  const { user, loadingAuth } = useAuth();
  const history = useHistory();

  // ✅ Redirect only after authentication check completes
  useEffect(() => {
    if (!loadingAuth && !user) {
      history.replace("/"); // Prevents back navigation
    }
  }, [user, loadingAuth, history]);

  if (loadingAuth) {
    return (
      <AnimatePresence>
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
      </AnimatePresence>
    );
  }

  return (
    <Route
      {...rest}
      render={(props) =>
        user ? (
          Component ? (
            <Component {...props} />
          ) : (
            children
          )
        ) : (
          <Redirect to="/" />
        )
      }
    />
  );
};

export default ProtectedRoute;