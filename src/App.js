import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import AdminHome from './pages/AdminHome';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Register from './pages/Register';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';


function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          
          <Route exact path="/" component={Login} />
          <Route exact path="/login" component={Login} />
          <AuthRoute exact path="/home" component={Home} />

          <Route exact path="/adminlogin" component={AdminLogin} />
          <AuthRoute exact path="/adminhome" component={AdminHome} />

          <Route exact path="/register" component={Register} />
        </Container>
      </Router>
    </AuthProvider>
  );
}

export default App;