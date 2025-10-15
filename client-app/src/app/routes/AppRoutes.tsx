import Home from "./Home";
import Account from "./Account";

export const appRoutes = () => [
  { path: "/", exact: true, redirectTo: "/home" },
  { path: "/home", exact: true, component: Home },
  { path: "/account", exact: true, protected: true, component: Account },
];