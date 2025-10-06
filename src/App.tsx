import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CreateTicketForm from './components/CreateTicketForm';
import UpdateTicketForm from './components/UpdateTicketForm';
import './App.css'
import tokenService from './services/token.service';
import 'bootstrap/dist/css/bootstrap.min.css';
import TicketNavbar from './components/TicketNavbar';

const isAuthenticated = () => {
  debugger;
  const token = tokenService.getLocalAccessToken();
  if (!token) {
    return false; // No token provided, consider it expired
  }

  return true;
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  var x = tokenService.getLocalAccessToken();
  return x ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
      <Router>
        <TicketNavbar />
        <Routes>
          {<Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <LoginForm />} />}
          <Route
            path="/login"
            element={
              <LoginForm />
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/create-ticket"
            element={
              <PrivateRoute>
                <CreateTicketForm />
              </PrivateRoute>
            }
          />
          <Route
            path="/update-ticket/:id"
            element={
              <PrivateRoute>
                <UpdateTicketForm />
              </PrivateRoute>
            }
          />
        </Routes>
      </Router>

  );
};

export default App;