import React, { useEffect, useState, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the ChartDataLabels plugin
import axios from 'axios';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import './FinanceTracker.css'; // Import the CSS file

// Register Chart.js components and the data labels plugin
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ChartDataLabels);

const FinanceTracker = () => {
  const [entries, setEntries] = useState([]);
  const contentRef = useRef(); // Reference for PDF generation
  const BARS_PER_CHART = 10; // Set the maximum number of bars per chart

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

  // Split entries into chunks based on BARS_PER_CHART
  const chunkArray = (array, chunkSize) => {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
      result.push(array.slice(i, i + chunkSize));
    }
    return result;
  };

  // Create chart data for each chunk
  const createChartData = (dataChunk) => ({
    labels: dataChunk.map((entry) => `${entry.category}`), // Combine category and amount
    datasets: [
      {
        label: 'Amount ($)',
        data: dataChunk.map((entry) => entry.amount), // Amounts for the Y-axis
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1,
      },
    ],
  });

  // Generate chart options
  const getChartOptions = () => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Finance Summary by Category and Spend Amount',
      },
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value) => `$${value.toFixed(2)}`, // Format amount to show on top of bars
        color: 'black',
        font: {
          weight: 'bold',
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  });

  // Function to generate PDF
  const generatePDF = () => {
    const content = contentRef.current;

    // Use html2canvas to create a high-resolution image
    html2canvas(content, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 295;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // Add the first image
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // Add additional pages if needed
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      pdf.save('finance-tracking.pdf');
    });
  };

  // Split entries into chunks for separate charts
  const entryChunks = chunkArray(entries, BARS_PER_CHART);

  return (
    <div className="finance-tracker">
      <h1 className="title">Finance Tracker</h1>

      {/* Both Chart and Finance Summary */}
      <div ref={contentRef} className="content">
        <h2>Finance Summary</h2>
        {entries.length === 0 ? (
          <p className="loading">Loading data...</p>
        ) : (
          <>
            {/* Render multiple Bar charts */}
            {entryChunks.map((chunk, index) => (
              <div key={index} className="chart-container">
                <Bar data={createChartData(chunk)} options={getChartOptions()} />
              </div>
            ))}

            {/* Render Finance Summary */}
            <table className="finance-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {entries.map((entry, index) => (
                  <tr key={index}>
                    <td>{entry.category}</td>
                    <td>${entry.amount.toFixed(2)}</td> {/* Formatting amount */}
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
      </div>

      {/* Button to generate PDF */}
      <button className="download-btn" onClick={generatePDF}>
        Download PDF
      </button>
    </div>
  );
};

export default FinanceTracker;
