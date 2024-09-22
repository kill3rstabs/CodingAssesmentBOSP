import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Reviews from './components/Review';  // Import your Reviews component

const App = () => {
  return (
    <Router>
      <div>
        {/* Use Routes instead of Switch */}
        <Routes>
          {/* Define route for login */}
          <Route path="/login" element={<Login />} />

          {/* Define route for registration */}
          <Route path="/register" element={<Register />} />

          {/* Define route for reviews */}
          <Route path="/reviews" element={<Reviews />} />

          {/* Default route, navigate to login */}
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
