import Home from "../pages/Home";
import Testing from "../pages/Testing";
import Account from "../pages/Account";

export const appRoutes = () => [
  { path: "/", exact: true, redirectTo: "/home" },
  { path: "/home", exact: true, component: Home },
  { path: "/testing", exact: true, component: Testing },
  { path: "/account", exact: true, protected: true, component: Account },
];