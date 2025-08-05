import { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { PiMotorcycle } from 'react-icons/pi';
import { RiBikeLine } from 'react-icons/ri';
import axios from 'axios';

const DriverPerformanceChart = () => {
  const [series, setSeries] = useState([
    {
      name: "Moto-taxis",
      data: Array(12).fill(0)
    },
    {
      name: "Trycycles",
      data: Array(12).fill(0)
    }
  ]);

  const [loading, setLoading] = useState(true);
const API_URL = "https://wegoadmin-c5c82e2c5d80.herokuapp.com/api/v1"
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${API_URL}/dashboard/driver-performance`);
        const { motoTaxi, tricycle } = response.data.data;

        setSeries([
          {
            name: "Moto-taxis",
            data: motoTaxi
          },
          {
            name: "Trycycles",
            data: tricycle
          }
        ]);
      } catch (error) {
        console.error('Error fetching driver performance data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
    colors: ["#F4C509", "#06A257"], // Jaune et Vert comme spécifié
    legend: {
      position: 'top',
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow h-[400px]">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Performance des Chauffeurs</h3>
        <div className="flex space-x-2">
          <span className="flex items-center text-xs text-gray-500">
            <PiMotorcycle className="mr-1" style={{ color: '#F4C509' }} />
            Moto-taxis
          </span>
          <span className="flex items-center text-xs text-gray-500">
            <RiBikeLine className="mr-1" style={{ color: '#06A257' }} />
            Trycycles
          </span>
        </div>
      </div>
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
        </div>
      ) : (
        <Chart 
          options={options} 
          series={series} 
          type="bar" 
          height="90%"
        />
      )}
    </div>
  );
};

export default DriverPerformanceChart;