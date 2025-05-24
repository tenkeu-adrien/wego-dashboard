// import React from "react";
import Chart from "react-apexcharts";

const ApexBarChart = () => {
  const data = [
    { category: "Douala", value: 80, price: 1200 },
    { category: "Yaoundé", value: 70, price: 750 },
    { category: "Bafoussam", value: 40, price: 450 },
    { category: "Garoua", value: 30, price: 400 },
    { category: "Maroua", value: 25, price: 300 },
];


  return (
    <Chart
      type="bar"
      height={320}
      options={{
        chart: {
          toolbar: { show: false },
        },
        plotOptions: {
          bar: {
            horizontal: true,
            borderRadius: 4,
            barHeight: '60%',
          },
        },
        dataLabels: {
          enabled: true,
          formatter: function (val, opts) {
            const price = data[opts.dataPointIndex].price;
            return `€${price}`;
          },
          style: {
            fontSize: "12px",
            colors: ["#fff"],
          },
        },
        xaxis: {
          categories: data.map((d) => d.category),
          max: 100,
        },
        colors: ["#2563eb"], // bleu tailwind
      }}
      series={[
        {
          name: "Pourcentage",
          data: data.map((d) => d.value),
        },
      ]}
    />
  );
};

export default ApexBarChart;
