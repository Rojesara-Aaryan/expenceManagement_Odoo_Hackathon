import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Welcome from './components/Welcome';
import './index.css'; // Make sure this import is here
import ForgotPass from "./components/ForgotPass";
import Dashboard from "./components/Dashboard";
import Uploadsection from "./components/Uploadsection";
import EmployDetails from "./components/EmployDetails";
import Employesview from "./components/Employesview";
import Summerybar from "./components/Summerybar";
function App() {
  return (
    <Router>
      <Routes>
        {/* Default landing page */}
        <Route path="/" element={<Welcome />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        {/* Forgot password page */}
        <Route path="/forgot-password" element={<ForgotPass />} />

        {/* Employee main dashboard */}
        <Route path="/employee" element={<Employesview />} />

        {/* Individual subcomponents (for direct access/testing) */}
        <Route path="/upload" element={<Uploadsection />} />
        <Route path="/new" element={<EmployDetails />} />
        <Route path="/summary" element={<Summerybar />} />
      </Routes>
    </Router>
  );
}

export default App;