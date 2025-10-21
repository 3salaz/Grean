import { Route, Switch, Redirect } from "react-router-dom";
import ProtectedRoute from "@/app/routes/ProtectedRoute";

import Account from "@/app/routes/Account";
import DriverLayout from "@/app/layouts/DriverLayout";
import PublicLayout from "@/app/layouts/PublicLayout";

// Pages
import Home from "@/app/routes/Home";
import ErrorPage from "@shared/components/ErrorPage";

export default function AppContent() {
  return (
    <Switch>
      <Route exact path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      <ProtectedRoute path="/account">
        <DriverLayout>
          <Account />
        </DriverLayout>
      </ProtectedRoute>

      {/* Catch-all */}
      <Route path="*">
        <DriverLayout>
          <ErrorPage />
        </DriverLayout>
      </Route>

      <Redirect to="/" />
    </Switch>
  );
}

