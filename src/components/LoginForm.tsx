import React, { useState } from 'react';
import AuthService from '../services/auth.service';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Form } from 'react-bootstrap';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<string>("");
  //const { login } = useContext(UserContext);

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await AuthService.login(email, password).then(
      (response) => {
        if (response.status === 401 || response.status === 400) {
          const resMessage = response.data.error;
          setMessage(resMessage);
        } else {
          navigate('/dashboard');
        }
      }
    )
  };

  return (
    <div className="login-container">
      <div className="d-flex align-items-center login-div">
        <div>
          <img className="sj-gif" src="/sj.gif" alt="sj-logo" />
        </div>
        <Container className="mt-5">
          <h2 className="mb-4 text-center">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formBasicEmail" className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword" className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100">
              Login
            </Button>
          </Form>
          {message !== "" && <p id="error-message">{message}</p>}
        </Container>
      </div>
    </div>

  );
};

export default LoginForm;