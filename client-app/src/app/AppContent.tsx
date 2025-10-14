import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import AppLayout from "@/app/layouts/AppLayout";
import Landing from "@/components/Layout/Views/Landing";
import Services from "@/components/Layout/Views/Services";
import Contact from "@/components/Layout/Views/Contact";
import Account from "@/pages/Account";
import ProtectedRoute from "@/pages/ProtectedRoute";

export default function AppContent() {
  console.log("✅ Routing initialized");

  return (
    <AppLayout>
      <Switch>
        <Route exact path="/" component={Landing} />

        {/* Protected routes */}
        <ProtectedRoute exact path="/account" component={Account} />

        {/* Catch-all redirect */}
        <Redirect to="/" />
      </Switch>
    </AppLayout>
  );
}