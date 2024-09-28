import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import axios from 'axios';

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Chart = () => {
  const [entries, setEntries] = useState([]);

  // Fetch finance data from the API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/finance');
        setEntries(response.data); // Assuming the data is an array of finance objects
      } catch (error) {
        console.error('Error fetching finance data:', error);
      }
    };

    fetchData();
  }, []);

  // Prepare chart data
  const chartData = {
    labels: entries.map((entry) => entry.category), // Categories for the X-axis
    datasets: [
      {
        label: 'Amount ($)',
        data: entries.map((entry) => entry.amount), // Amounts for the Y-axis
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Finance Summary by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div>
      <h2>Finance Chart</h2>
      {/* Render the chart only if we have entries */}
      {entries.length > 0 ? <Bar data={chartData} options={options} /> : <p>Loading data...</p>}
    </div>
  );
};

export default Chart;
