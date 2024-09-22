import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import Reviews from './components/Review';  // Import your Reviews component
import Statistics from './components/Statistics';
const App = () => {
  return (
    <Router>
      <div>
       
        <Routes>
          
          <Route path="/login" element={<Login />} />

         
          <Route path="/register" element={<Register />} />

          
          <Route path="/reviews" element={<Reviews />} />

          
          <Route path="/" element={<Login />} />

          <Route path="/statistics" element={<Statistics />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
