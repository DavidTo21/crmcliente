import Head from 'next/head';
import Layout from '../components/Layout';
import {gql, useQuery} from '@apollo/client';
import { useRouter } from 'next/router';
import Link from 'next/link';
import Producto from '../components/Producto';

const OBTENER_PRODUCTOS = gql`
  query ObtenerProductos {
  obtenerProductos {
    id
    nombre
    existencia
    precio
    creado
  }
}
`;

const Productos = () => {

    const { data, loading, error } = useQuery(OBTENER_PRODUCTOS);

    //PROTEGER QUE NO SE ACCEDA A DATA ANTES DE OBTENER RESULTADOS
    if(loading) return null;

    //SI NO HAY INFORMACION
    if(!data.obtenerProductos) {
        return router.push('login');
    }

    return (
        <div>
        <Layout>
        <h1 className="text-2xl text-gray-800 font-light">Productos</h1>

        <Link legacyBehavior href='/nuevoProducto'>
          <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>Nuevo Producto</a>
        </Link>

        <table className="table-auto shadow-md mt-10 w-full w-lg">
            <thead className="bg-gray-800">
              <tr className="text-white">
                <th className="w-1/5 py-2">NOMBRE</th>
                <th className="w-1/5 py-2">EXISTENCIA</th>
                <th className="w-1/5 py-2">PRECIO</th>
                <th className="w-1/5 py-2">ELIMINAR</th>
                <th className="w-1/5 py-2">EDITAR</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {data.obtenerProductos.map((producto) => (
                <Producto
                key= {producto.id}
                producto={producto}
                />
              ))}
            </tbody>
          </table>
        </Layout>
    </div>
    );
}

export default Productos;