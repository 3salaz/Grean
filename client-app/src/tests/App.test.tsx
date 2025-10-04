import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import App from "../App";

// Mock dependencies
jest.mock("@ionic/react", () => ({
  ...jest.requireActual("@ionic/react"),
  IonApp: ({ children }: { children: React.ReactNode }) => <div data-testid="ion-app">{children}</div>,
  IonContent: ({ children }: { children: React.ReactNode }) => <div data-testid="ion-content">{children}</div>,
  IonRouterOutlet: ({ children }: { children: React.ReactNode }) => <div data-testid="ion-router-outlet">{children}</div>,
}));

jest.mock("./components/Layout/Navbar", () => () => <nav data-testid="navbar">Navbar</nav>);
jest.mock("./pages/Home", () => () => <div data-testid="home-page">Home Page</div>);
jest.mock("./pages/Account", () => () => <div data-testid="account-page">Account Page</div>);
jest.mock("./pages/ProtectedRoute", () => ({ children }: { children: React.ReactNode }) => <>{children}</>);

// Mock Providers
jest.mock("./context/AuthContext", () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: jest.fn(() => ({ user: { uid: "test-user" } })), // Mock authenticated user
}));

jest.mock("./context/ProfileContext", () => ({
  ProfileProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("./context/PickupsContext", () => ({
  PickupsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

jest.mock("./context/LocationsContext", () => ({
  LocationsProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe("App Component", () => {
  test("renders without crashing", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("ion-app")).toBeInTheDocument();
  });

  test("renders Navbar", () => {
    render(
      <MemoryRouter>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("navbar")).toBeInTheDocument();
  });

  test("renders Home Page by default", () => {
    render(
      <MemoryRouter initialEntries={["/home"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });

  test("renders Account Page when authenticated", () => {
    render(
      <MemoryRouter initialEntries={["/account"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("account-page")).toBeInTheDocument();
  });

  test("redirects from `/` to `/home`", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByTestId("home-page")).toBeInTheDocument();
  });
});
