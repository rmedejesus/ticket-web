import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import Dashboard from './components/Dashboard';
import CreateTicketForm from './components/CreateTicketForm';
import UpdateTicketForm from './components/UpdateTicketForm';
import './App.css'
import tokenService from './services/token.service';
import { jwtDecode } from 'jwt-decode';
import type { ITokenDecode } from './types/token-decode';
import 'bootstrap/dist/css/bootstrap.min.css';
import TicketNavbar from './components/TicketNavbar';
import { UserProvider } from './context/user.context';

const isAuthenticated = () => {
  const token = tokenService.getLocalAccessToken();
  if (!token) {
    return false; // No token provided, consider it expired
  }
  try {
    const decodedToken = jwtDecode<ITokenDecode>(token.refresh_token);
    const currentTime = Date.now() / 1000; // Convert milliseconds to seconds
    return decodedToken.exp > currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return false; // Handle decoding errors, e.g., malformed token
  }
};

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" />;
};

const App: React.FC = () => {
  return (
    <UserProvider>
      <Router>
        <TicketNavbar />
        <Routes>
          <Route path="/" element={isAuthenticated() ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route
            path="/login"
            element={
              <LoginForm />
            }
          />
          <Route
            path="/"
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
    </UserProvider>

  );
};

export default App;