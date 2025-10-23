import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Employees from './pages/Employees';
import Documents from './pages/Documents';
import Eventos from './pages/Eventos';

const App = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route path="/login" component={Login} />
        <PrivateRoute path="/employees" component={Employees} />
        <PrivateRoute path="/documents" component={Documents} />
        <PrivateRoute path="/eventos" component={Eventos} />
        <Route path="/" exact component={Login} />
      </Switch>
    </Router>
  );
};

export default App;