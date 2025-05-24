import Chart from 'react-apexcharts';
import { PiMotorcycle } from 'react-icons/pi';
import { RiBikeLine } from 'react-icons/ri';

const DriverPerformanceChart = () => {
  const options = {
    chart: {
      type: 'bar',
      stacked: true,
      toolbar: { show: false },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        borderRadius: 4,
        columnWidth: '70%',
      },
    },
    dataLabels: {
      enabled: false
    },
    stroke: {
      show: true,
      width: 2,
      colors: ['transparent']
    },
    xaxis: {
      categories: [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ],
    },
    yaxis: {
      title: {
        text: "Nombre de courses",
      },
      labels: {
        formatter: (val) => Math.floor(val),
      },
    },
    colors: ["#7c3aed", "#10b981"],
    legend: {
      position: 'top',
    }
  };

  const series = [
    {
      name: "Moto-taxis",
      data: [65, 59, 80, 71, 76, 65, 87, 82, 73, 85, 90, 92]
    },
    {
      name: "Trycycles",
      data: [35, 31, 40, 29, 34, 35, 43, 38, 37, 45, 40, 38]
    }
  ];

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Performance des Chauffeurs</h3>
        <div className="flex space-x-2">
          <span className="flex items-center text-xs text-gray-500">
            <PiMotorcycle className="mr-1 text-purple-600" />
            Moto-taxis
          </span>
          <span className="flex items-center text-xs text-gray-500">
            <RiBikeLine className="mr-1 text-green-500" />
            Trycycles
          </span>
        </div>
      </div>
      <Chart 
        options={options} 
        series={series} 
        type="bar" 
        height="90%"
      />
    </div>
  );
};

export default DriverPerformanceChart;