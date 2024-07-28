import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Login.css';
import BackgroundImage from '../../assets/images/background.png';
import Logo from '../../assets/images/logo.png';

const notify = (msg, type) => {
  toast[type](msg, {
    position: 'top-right',
    autoClose: 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: 'light',
  });
};

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    console.log(email);
    console.log(password);

    try {
      const response = await axios.post(
        'http://localhost:8000/sign-in',
        { email, password },
        { withCredentials: true }
      );
      
      console.log(response);

      if (response.status !== 200) {
        notify('Invalid email or password', 'error');
      } else {
        // Handle successful login (e.g., redirect user, store token, etc.)
        notify('Login successful', 'success')
        console.log('Login successful');
      }
    } catch (err) {
      console.log(err);
      notify('An error occurred', 'error');
    }
  };

  return (
    <div
      className="sign-in-wrapper"
      style={{ backgroundImage: `url(${BackgroundImage})` }}
    >
      <ToastContainer />
      <div className="sign-in-backdrop"></div>
      <Form className="shadow p-4 bg-white rounded" onSubmit={handleSubmit}>
        <img
          className="img-thumbnail mx-auto d-block mb-2 logo"
          src={Logo}
          alt="logo"
        />
        <div className="h4 mb-2 text-center">Sign In</div>
        <Form.Group className="mb-2" controlId="email">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={email}
            placeholder="Enter your email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </Form.Group>
        <Form.Group className="mb-2" controlId="remember-me">
          <Form.Check type="checkbox" label="Remember me" />
        </Form.Group>
        <Button className="w-100" variant="primary" type="submit">
          Log In
        </Button>
        <div className="d-grid justify-content-end mt-2">
          <Button className="text-muted px-0" variant="link">
            Forgot password?
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default Login;
