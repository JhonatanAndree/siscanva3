import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Edit, Trash2, Plus } from 'lucide-react';
import { getClients, deleteClient } from '../services/api';

type Client = {
  id: number;
  name: string;
  email: string;
  whatsapp: string;
  licensePeriod: number;
  tag: string;
  startDate: string;
  endDate: string;
};

const ClientList: React.FC = () => {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const data = await getClients();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este cliente?')) {
      try {
        await deleteClient(id);
        fetchClients(); // Recargar la lista después de eliminar
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Lista de Clientes</h1>
        <Link to="/clients/new" className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center">
          <Plus size={20} className="mr-2" />
          Nuevo Cliente
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">WhatsApp</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Periodo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Etiqueta</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Inicio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fin</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clients.map((client) => (
              <tr key={client.id}>
                <td className="px-6 py-4 whitespace-nowrap">{client.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <a href={`https://wa.me/${client.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-900">
                    {client.whatsapp}
                  </a>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{client.licensePeriod} meses</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.tag}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.startDate}</td>
                <td className="px-6 py-4 whitespace-nowrap">{client.endDate}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <Link to={`/clients/edit/${client.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit size={20} />
                  </Link>
                  <button onClick={() => handleDelete(client.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ClientList;