import React from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

const Chart = ({ data }) => {
  const chartData = {
    labels: ["Player", "Banker", "Tie"],
    datasets: [
      {
        data: [51, 38, 11],
        backgroundColor: [
          "rgba(0,136,204,1)",
          "rgba(189,24,40,1)",
          "rgba(8,111,63,1)",
        ],
        borderWidth: 0,
      },
    ],
  };

  // Define chart options (optional)
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true, 
          pointStyle: "circle", 
        },
        onClick: null,
      },
      tooltip: {
        enabled: true,
      },
    },
  };

  return (
    <div style={{ width: "200px", height: "150px" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default Chart;
