import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, DollarSign } from 'lucide-react';
import { getDashboardData } from '../services/api';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState({ totalClients: 0, totalRevenue: 0 });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const data = await getDashboardData();
        setDashboardData(data);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Total de Clientes</h2>
            <Users className="text-blue-500" size={24} />
          </div>
          <p className="text-3xl font-bold mt-2">{dashboardData.totalClients}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Ingresos Totales</h2>
            <DollarSign className="text-green-500" size={24} />
          </div>
          <p className="text-3xl font-bold mt-2">S/ {dashboardData.totalRevenue.toFixed(2)}</p>
        </div>
      </div>
      <div className="mt-8">
        <Link to="/clients" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Ver Lista de Clientes
        </Link>
      </div>
    </div>
  );
};

export default Dashboard;