import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import LoginSignUp from "./components/LoginSignUp";
import EventDashboard from "./pages/EventDashboard";
import EventDetails from "./components/EventDetails";
import Dashboard from "./pages/Dashboard";
import Judge from "./components/Judge";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/auth" element={<LoginSignUp />} />
        <Route path="/events" element={<EventDashboard />} />
        <Route path="/event/:id" element={<EventDetails />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/judge" element={<Judge />} />
      </Routes>
    </Router>
  );
}

export default App;
