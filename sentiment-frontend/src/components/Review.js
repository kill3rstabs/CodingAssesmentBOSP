import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Review.css';
import { BASE_URL } from '../index';

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    movie_title: '',
    content: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const token = localStorage.getItem('authToken');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/reviews?page=${currentPage}`, {
          headers: {
            'Authorization': `Token ${token}`,
          },
        });
        setReviews(response.data.results);
        setTotalPages(Math.ceil(response.data.count / 5)); // Update this line
      } catch (error) {
        console.log('Error fetching reviews:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };

    fetchReviews();
  }, [token, navigate, currentPage]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/submit`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Token ${token}`,
        },
      });

      setReviews([...reviews, response.data]);
      setFormData({ movie_title: '', content: '' });
      alert('Review submitted successfully!');
    } catch (error) {
      console.error('Error submitting review:', error);
      if (error.response && error.response.status === 401) {
        alert('You must be logged in to submit a review.');
        setTimeout(() => {
          navigate('/login');
        }, 1000);
      } else {
        alert('Failed to submit review. Please try again.');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/login');
  };


  const handleStatistics = () => {
    navigate('/statistics'); // Navigate to statistics page
  };
  
  return (
    <div className="container">
      <h1 className="title">Your Movie Reviews</h1>
      <button onClick={handleLogout}>Logout</button>
      <button onClick={handleStatistics} style={{ marginLeft: '10px' }}>View Statistics</button>
      <div className="form-container">
        <h2 className="form-title">Submit a New Review</h2>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label htmlFor="movie_title" className="label">Movie Title</label>
            <input
              id="movie_title"
              name="movie_title"
              type="text"
              value={formData.movie_title}
              onChange={handleChange}
              required
              className="input"
            />
          </div>
          <div className="form-group">
            <label htmlFor="content" className="label">Review Content</label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              required
              rows={4}
              className="textarea"
            />
          </div>
          <button type="submit" className="submit-button">Submit Review</button>
        </form>
      </div>

      {reviews.length === 0 ? (
        <p className="no-reviews">No reviews found.</p>
      ) : (
        <div className="table-container">
          <table className="reviews-table">
            <thead>
              <tr>
                <th>Movie Title</th>
                <th>Review</th>
                <th>Sentiment</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {reviews.map((review) => (
                <tr key={review.id}>
                  <td>{review.movie_title}</td>
                  <td>{review.content}</td>
                  <td>{review.sentiment}</td>
                  <td>{new Date(review.created_at).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      <div className="pagination">
        <button 
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button 
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}
