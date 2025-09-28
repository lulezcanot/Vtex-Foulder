import { RouterProvider } from "react-router-dom";
import router from "./routes";
import "./App.css";
import { SessionProvider } from "./context/SessionContext";
import { ToastProvider } from "./context/ToastContext";
import ToastContainer from "./components/Toast";
import ErrorBoundary from "./components/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <div className="bg-slate-900 min-h-screen">
        <ToastProvider>
          <SessionProvider>
            <RouterProvider router={router} />
            <ToastContainer />
          </SessionProvider>
        </ToastProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;
