import React from 'react';
import { Pie, Line } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import './AnalyticsPanel.css';

ChartJS.register(ArcElement, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, ChartDataLabels);

const AnalyticsPanel = ({ nodes, connections }) => {
  const nodeTypes = nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(nodeTypes),
    datasets: [
      {
        data: Object.values(nodeTypes),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#FF9F40'],
        hoverOffset: 4,
      },
    ],
  };

  const pieOptions = {
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}`;
          },
        },
      },
      datalabels: {
        formatter: (value, context) => {
          return `${value}`;
        },
        color: '#fff',
        font: {
          weight: 'bold',
          size: 16,
        },
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  const lineData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Connections',
        data: connections.map((conn) => conn.count),
        fill: true,
        borderColor: '#4BC0C0',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        tension: 0.1,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        beginAtZero: true,
      },
      y: {
        beginAtZero: true,
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Connections: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="analytics">
      <h2>Workflow Analytics</h2>

      <div className="analytics-card">
        <h3>Total Nodes</h3>
        <div className="chart-container">
          <Pie data={pieData} options={pieOptions} />
        </div>
      </div>

      <div className="analytics-card">
        <h3>Total Connections</h3>
        <div className="chart-container">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      <div className="analytics-card">
        <h3>Node Types</h3>
        <ul>
          {Object.keys(nodeTypes).map((type) => (
            <li key={type}>
              {type}: {nodeTypes[type]}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default AnalyticsPanel;
