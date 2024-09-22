import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { BASE_URL } from '../index';
import '../styles/Statistics.css';

// Register the required components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Statistics = () => {
  const [sentimentData, setSentimentData] = useState({ labels: [], datasets: [] });
  const [movieData, setMovieData] = useState([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/statistics`, {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`,
          },
        });
        const sentimentCounts = response.data.sentiment_counts || [];
        const movieCounts = response.data.movie_counts || [];

        // Prepare data for sentiment chart
        const labels = sentimentCounts.map(item => item.sentiment);
        const data = sentimentCounts.map(item => item.count);
        
        setSentimentData({
          labels,
          datasets: [{
            label: 'Number of Reviews per Sentiment',
            data,
            backgroundColor: ['rgba(75, 192, 192, 0.6)', 'rgba(255, 206, 86, 0.6)', 'rgba(255, 99, 132, 0.6)'],
          }],
        });

        // Prepare data for movie chart
        setMovieData(movieCounts);
      } catch (error) {
        console.error('Error fetching statistics:', error);
      }
    };

    fetchStatistics();
  }, []);

  const pieData = {
    labels: movieData.map(movie => movie.movie_title),
    datasets: [{
      data: movieData.map(movie => movie.count),
      backgroundColor: [
        'rgba(255, 99, 132, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(153, 102, 255, 0.6)',
      ],
    }],
  };

  return (
    <div className="statistics-container">
      <h2>Review Statistics</h2>
      <h3>Sentiment Analysis</h3>
      <div className="chart-container">
        <Bar data={sentimentData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
      </div>

      <h3>Most Frequently Reviewed Movies</h3>
      <div className="chart-container">
        <Pie data={pieData} options={{ responsive: true, maintainAspectRatio: false }} height={200} />
      </div>

      <ul>
        {movieData.map(movie => (
          <li key={movie.movie_title}>
            {movie.movie_title} - {movie.count} reviews
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Statistics;
