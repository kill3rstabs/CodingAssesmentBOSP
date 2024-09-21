// src/App.js
import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';

const App = () => {
  const [isLogin, setIsLogin] = useState(true);

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div>
      <h1>{isLogin ? 'Welcome to the Login Page' : 'Welcome to the Registration Page'}</h1>
      {isLogin ? <Login /> : <Register />}
      <button onClick={toggleForm}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default App;
