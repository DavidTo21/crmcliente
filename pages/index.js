import Head from 'next/head';
import Layout from '../components/Layout';
import {gql, useQuery} from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Cliente from '../components/Cliente';

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
  const router = useRouter();

  const { data, loading, error } = useQuery(OBTENER_CLIENTES_USUARIO);

      //PROTEGER QUE NO SE ACCEDA A DATA ANTES DE OBTENER RESULTADOS
      if(loading) return null;

      //SI NO HAY INFORMACION
      if(!data.obtenerClientesVendedor) {
          return router.push('login');
      }

  return (
    <div>
      <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Clientes</h1>
        <Link legacyBehavior href='/nuevoCliente'>
          <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>Nuevo Cliente</a>
        </Link>


          <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">NOMBRE</th>
                <th className="w-1/5 py-2">EMPRESA</th>
                <th className="w-1/5 py-2">EMAIL</th>
                <th className="w-1/5 py-2">ELIMINAR</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerClientesVendedor.map((cliente) => (
                <Cliente
                key= {cliente.id}
                cliente={cliente}
                />
              ))}
            </tbody>
          </table>
      </Layout>
    </div>
  );
};

export default Index;
