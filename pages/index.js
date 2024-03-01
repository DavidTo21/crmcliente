import Head from 'next/head';
import Layout from '../components/layout';
import {gql, useQuery} from '@apollo/client';
import { use } from 'react';

const OBTENER_CLIENTES_USUARIO = gql`
  query ObtenerClientesVendedor {
    obtenerClientesVendedor {
      id
      nombre
      apellido
      empresa
      email
    }
}
`;

const Index = () => {
  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>Error: {error.message}</p>
        ) : (
          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">NOMBRE</th>
                <th className="w-1/5 py-2">EMPRESA</th>
                <th className="w-1/5 py-2">EMAIL</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map((cliente) => (
                <tr key={cliente.id}>
                  <td className="border px-4 py-2">{cliente.nombre} {cliente.apellido}</td>
                  <td className="border px-4 py-2">{cliente.empresa}</td>
                  <td className="border px-4 py-2">{cliente.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Layout>
    </div>
  );
};

export default Index;
