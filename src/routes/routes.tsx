import Home from "../pages/Home";
import Testing from "../pages/Testing";
import Account from "../pages/Account";
import ProtectedRoute from "../pages/ProtectedRoute";
import { Redirect } from "react-router-dom";

export const appRoutes = (
) => [
  {
    path: "/",
    element: <Redirect to="/home" />,
  },
  {
    path: "/home",
    element: <Home />,
  },
  {
    path: "/testing",
    element: <Testing />,
  },
  {
    path: "/account",
    element: (
      <ProtectedRoute>
        <Account />
      </ProtectedRoute>
    ),
  },
];
