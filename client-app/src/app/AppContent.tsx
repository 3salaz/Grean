import { Route, Switch, Redirect } from "react-router-dom";
import PublicLayout from "@/app/layouts/PublicLayout";
import ClientLayout from "@/app/layouts/ClientLayout";
import ProtectedRoute from "@/app/routes/ProtectedRoute";

import Home from "@/app/routes/Home";
import Account from "@/app/routes/Account";
import ErrorPage from "@/app/routes/ErrorPage";

export default function AppContent() {
  return (
    <Switch>
      {/* Public routes */}
      <Route exact path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>

      {/* Protected client routes */}
      <ProtectedRoute path="/account">
        <ClientLayout>
          <Account />
        </ClientLayout>
      </ProtectedRoute>

      {/* Catch-all */}
      <Route path="*">
        <PublicLayout>
          <ErrorPage />
        </PublicLayout>
      </Route>

      <Redirect to="/" />
    </Switch>
  );
}