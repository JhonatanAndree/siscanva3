import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { getClient, createClient, updateClient } from '../services/api';

type ClientFormData = {
  name: string;
  email: string;
  whatsapp: string;
  licensePeriod: number;
  tag: string;
  comments: string;
};

const ClientForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { register, handleSubmit, setValue, formState: { errors } } = useForm<ClientFormData>();

  useEffect(() => {
    if (id) {
      fetchClient(parseInt(id));
    }
  }, [id]);

  const fetchClient = async (clientId: number) => {
    try {
      const clientData = await getClient(clientId);
      Object.keys(clientData).forEach((key) => {
        setValue(key as keyof ClientFormData, clientData[key]);
      });
    } catch (error) {
      console.error('Error fetching client:', error);
    }
  };

  const onSubmit = async (data: ClientFormData) => {
    try {
      if (id) {
        await updateClient(parseInt(id), data);
      } else {
        await createClient(data);
      }
      navigate('/clients');
    } catch (error) {
      console.error('Error saving client:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{id ? 'Editar Cliente' : 'Nuevo Cliente'}</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Nombres
          </label>
          <input
            {...register('name', { required: 'Este campo es requerido' })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="name"
            type="text"
            placeholder="Nombres"
          />
          {errors.name && <span className="text-red-500 text-xs italic">{errors.name.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Correo Electrónico
          </label>
          <input
            {...register('email', { required: 'Este campo es requerido', pattern: { value: /^\S+@\S+$/i, message: 'Correo electrónico inválido' } })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="email"
            type="email"
            placeholder="Correo Electrónico"
          />
          {errors.email && <span className="text-red-500 text-xs italic">{errors.email.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="whatsapp">
            Número de WhatsApp
          </label>
          <div className="flex">
            <select
              className="shadow border rounded-l py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              defaultValue="+51"
            >
              <option value="+51">+51</option>
              {/* Añadir más códigos de país aquí */}
            </select>
            <input
              {...register('whatsapp', { required: 'Este campo es requerido', pattern: { value: /^\d+$/, message: 'Solo números permitidos' } })}
              className="shadow appearance-none border rounded-r w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="whatsapp"
              type="tel"
              placeholder="Número de WhatsApp"
            />
          </div>
          {errors.whatsapp && <span className="text-red-500 text-xs italic">{errors.whatsapp.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="licensePeriod">
            Periodo de licencia (meses)
          </label>
          <input
            {...register('licensePeriod', { required: 'Este campo es requerido', min: { value: 1, message: 'El mínimo es 1 mes' }, max: { value: 12, message: 'El máximo es 12 meses' } })}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="licensePeriod"
            type="number"
            min="1"
            max="12"
          />
          {errors.licensePeriod && <span className="text-red-500 text-xs italic">{errors.licensePeriod.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tag">
            Etiqueta
          </label>
          <select
            {...register('tag', { required: 'Este campo es requerido' })}
            className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="tag"
          >
            <option value="Gratis">Gratis</option>
            <option value="Desactivado">Desactivado</option>
            <option value="Activo">Activo</option>
            <option value="No renovó">No renovó</option>
          </select>
          {errors.tag && <span className="text-red-500 text-xs italic">{errors.tag.message}</span>}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="comments">
            Comentarios
          </label>
          <textarea
            {...register('comments')}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            id="comments"
            placeholder="Comentarios"
          ></textarea>
        </div>
        <div className="flex items-center justify-between">
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            type="submit"
          >
            {id ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ClientForm;