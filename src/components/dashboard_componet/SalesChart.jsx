import React from "react";
import Chart from "react-apexcharts";

const SalesChart = () => {
  const series = [
    {
      name: "Sales",
      data: [
        10, 41, 35,

        200, 2000, 3000, 1500, 200, 5000, 8000, 600, 4500, 150, 51, 49, 62, 69,
        100, 200, 500, 230, 40.29,
      ],
    },
  ];

  const options = {
    chart: {
      id: "sales-chart",
    },
    xaxis: {
      categories: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
  };

  return (
    <div>
      <Chart options={options} series={series} type="area" height={350} />
    </div>
  );
};

export default SalesChart;
