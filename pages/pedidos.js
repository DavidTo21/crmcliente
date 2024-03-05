import Head from 'next/head';
import Layout from '../components/Layout';
import Pedido from '../components/Pedido';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';

const OBTENER_PEDIDOS = gql`
    query ObtenerPedidosVendedor {
        obtenerPedidosVendedor {
            id
            pedido {
            id
            cantidad
            }
            total
            cliente
            vendedor
            creado
            estado
        }
    }
`;

const Pedidos = () => {

    const { loading, error, data } = useQuery(OBTENER_PEDIDOS);

    if(loading) return 'Cargando...';

    const { obtenerPedidosVendedor} = data;
    return (
        <div>
            <Layout>
                <h1 className="text-2xl text-gray-800 font-light">Pedidos</h1>

                <Link legacyBehavior href='/nuevoPedido'>
                    <a className='bg-blue-800 py-2 px-5 mt-3 inline-block text-white rounded text-sm hover:bg-gray-800 mb-3 uppercase font-bold'>Nuevo Pedido</a>
                </Link>

                { obtenerPedidosVendedor.length === 0 ? (
                    <p className='mt-5 text-center text-2x'> No existen pedidos registrados.</p>
                ) : (
                    obtenerPedidosVendedor.map( pedido => (
                        <Pedido
                            key= {pedido.id}
                            pedido={pedido}
                        /> 
                    ))
                ) }
            </Layout>
        </div>
    );
    
}

export default Pedidos;