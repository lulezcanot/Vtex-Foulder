import { createBrowserRouter } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import Verify2FA from "./pages/Verify2FA";
import Setup2FA from "./pages/Setup2FA";
import HomePage from "./pages/HomePage";
import ComponentsPage from "./pages/ComponentsPage";
import AddComponentPage from "./pages/AddComponentPage";
import ViewComponentPage from "./pages/ViewComponentPage";
import EditComponentPage from "./pages/EditComponentPage";
import Error from "./pages/Error";
import ProtectedRoute from "./components/ProtectedRoute";

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
    errorElement: <Error />,
  },

  {
    element: <ProtectedRoute />,
    children: [
      {
        path: "/",
        element: <ComponentsPage />,
        errorElement: <Error />,
      },

      {
        path: "/setup-2fa",
        element: <Setup2FA />,
        errorElement: <Error />,
      },

      {
        path: "/verify-2fa",
        element: <Verify2FA />,
        errorElement: <Error />,
      },

      {
        path: "/components",
        element: <ComponentsPage />,
        errorElement: <Error />,
      },

      {
        path: "/home",
        element: <HomePage />,
        errorElement: <Error />,
      },

      {
        path: "/components/add",
        element: <AddComponentPage />,
        errorElement: <Error />,
      },

      {
        path: "/components/:id",
        element: <ViewComponentPage />,
        errorElement: <Error />,
      },

      {
        path: "/components/:id/edit",
        element: <EditComponentPage />,
        errorElement: <Error />,
      },

    ],
  },
]);

export default router;
