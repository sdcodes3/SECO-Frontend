import "@/App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
import Layout from "@/Layout";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<LoginSignUp />} />
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<EventDashboard />} />

        <Route path="/event/:id" element={<EventDetails />} />
        <Route
          path="/dashboard"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/user-events"
          element={
            <Layout>
              <EventDashboard />
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
      </Routes>
    </Router>
  );
};

export default App;
