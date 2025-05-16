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

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginSignUp />} />
        <Route path="/events" element={<EventDashboard />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create-event" element={<CreateEvent />} />
        <Route path="/my-events" element={<MyEvents />} />
        <Route path="/profile" element={<Account />} />
        <Route path="/events/edit/:id" element={<EditEvent />} />
        <Route path="/discover" element={<Discover />} />
        <Route path="/vault" element={<Vault />} />
      </Routes>
    </Router>
  );
};

export default App;
