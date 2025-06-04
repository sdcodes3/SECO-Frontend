import "@/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from 'react-redux';
import store from './storage/store.ts'; 
import { useSelector } from 'react-redux';
import { selectIsLoggedIn } from "./slices/AuthSlice"; 
import Home from "@/components/Home";
import LoginSignUp from "@/components/LoginSignUp";
import EventDashboard from "@/pages/EventDashboard";
import EventDetails from "@/components/EventDetails";
import Dashboard from "@/pages/Dashboard";
import CreateEvent from "@/pages/CreateEvent";
import MyEvents from "@/pages/MyEvents";
import Account from "@/pages/Account";
import EditEvent from "@/pages/EditEvent";
import Discover from "@/pages/Discover";
import Vault from "@/pages/Vault";
import Investor from "@/pages/Investor";
import Layout from "@/Layout";
import Applications from "./pages/Applications";
import ApplyInEvent from "./pages/ApplyInEvent";
import Subscriptions from "./pages/Subscriptions";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
import SuperAdminUsers from "./pages/SuperAdminUsers";
import SuperAdminEvents from "./pages/SuperAdminEvents";
import SuperAdminSettings from "./pages/SuperAdminSettings";
import Judge from "./pages/Judge";
import Professionals from "./pages/Professionals";
import { OAuthCallback } from "./utils/OAuthCallback";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const isLoggedIn = useSelector(selectIsLoggedIn);

  return (
    <Provider store={store}>
      <Router>
        <Routes>
          <Route path="/auth" element={<LoginSignUp />} />
          <Route path="/" element={<Home />} />
          <Route path="/oauth-callback" element={<OAuthCallback />} />
          <Route
            path="/events"
            element={
              !isLoggedIn ? (
                <EventDashboard />
              ) : (
                <Layout>
                  <EventDashboard />
                </Layout>
              )
            }
          />
          <Route
            path="/event/:id"
            element={
              !isLoggedIn ? (
                <EventDetails />
              ) : (
                <Layout>
                  <EventDetails />
                </Layout>
              )
            }
          />
          <Route
            path="/dashboard"
            element={
              <Layout>
                <Dashboard />
              </Layout>
            }
          />
          <Route
            path="/judge"
            element={
              <Layout>
                <Judge />
              </Layout>
            }
          />
          <Route
            path="/dashboard/applications/apply/:id"
            element={
              <Layout>
                <ApplyInEvent />
              </Layout>
            }
          />
          <Route
            path="/create-event"
            element={
              <Layout>
                <CreateEvent />
              </Layout>
            }
          />
          <Route
            path="/my-events"
            element={
              <Layout>
                <MyEvents />
              </Layout>
            }
          />
          <Route
            path="/investors"
            element={
              <Layout>
                <Investor />
              </Layout>
            }
          />
          <Route
            path="/profile"
            element={
              <Layout>
                <Account />
              </Layout>
            }
          />
          <Route
            path="/events/edit/:id"
            element={
              <Layout>
                <EditEvent />
              </Layout>
            }
          />
          <Route
            path="/discover"
            element={
              <Layout>
                <Discover />
              </Layout>
            }
          />
          <Route
            path="/vault"
            element={
              <Layout>
                <Vault />
              </Layout>
            }
          />
          <Route
            path="/professionals"
            element={
              <Layout>
                <Professionals />
              </Layout>
            }
          />
          <Route
            path="/applications"
            element={
              <Layout>
                <Applications />
              </Layout>
            }
          />
          <Route
            path="/subscriptions"
            element={
              <Layout>
                <Subscriptions />
              </Layout>
            }
          />
          <Route
            path="/super-admin"
            element={
              <Layout>
                <SuperAdminDashboard />
              </Layout>
            }
          />
          <Route
            path="/super-admin/users"
            element={
              <Layout>
                <SuperAdminUsers />
              </Layout>
            }
          />
          <Route
            path="/super-admin/events"
            element={
              <Layout>
                <SuperAdminEvents />
              </Layout>
            }
          />
          <Route
            path="/super-admin/settings"
            element={
              <Layout>
                <SuperAdminSettings />
              </Layout>
            }
          />
        </Routes>
      </Router>
      <ToastContainer position="top-center" autoClose={5000} />
    </Provider>
  );
};

export default App;