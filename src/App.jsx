import { Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register.jsx";
import "./App.css";
import Dashboard from "./components/Dashboard.jsx";
import ForgotPassword from "./pages/ForgotPassword.jsx";
import * as Sentry from "@sentry/react";
import ProtectedRoutes from "./pages/ProtectedRoutes.jsx";
import Login from "./pages/Login.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SubscriptionDetailsPage from "./components/subscription/SubscriptionDetailsPage.jsx";
import MerchantDashboard from "./components/dashboard_componet/MerchantDashboard.jsx";
// const client = new QueryClient({
//   defaultOptions: {
//     queries: {
//       staleTime: 1000 * 60 * 5,
//     },
//   },
// });

const client = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      onError: (error) => {
        Sentry.captureException(error);
      },
    },
    mutations: {
      onError: (error) => {
        Sentry.captureException(error);
      },
    },
  },
});
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotpassword" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/subscriptions" element={<SubscriptionDetailsPage />} />
        {/* <Route path="/merchant-dashboard" element={<MerchantDashboard />} /> */}

        <Route
          path="/dashboard"
          element={
            <QueryClientProvider client={client}>
              <ProtectedRoutes>
                <Dashboard />
              </ProtectedRoutes>
            </QueryClientProvider>
          }
        />
      </Routes>
    </>
  );
}

export default App;
