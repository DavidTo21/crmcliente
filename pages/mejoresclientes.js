import React, { PureComponent, useEffect } from 'react';
import { BarChart, Bar, Rectangle, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import Layout from '../components/Layout';
import { gql, useQuery } from '@apollo/client';

const MEJORES_CLIENTES = gql`
    query MejoresClientes {
        mejoresClientes {
            total
            cliente {
            nombre
            apellido
            email
            }
        }
    }
`;

const MejoresClientes = () => {

    const { data, loading, error, startPolling, stopPolling } = useQuery(MEJORES_CLIENTES);

    useEffect(() => {
        startPolling(1000);
        return () => {
            stopPolling();
        }
    },[startPolling, stopPolling])

    if (loading) return 'Cargando...';

    const { mejoresClientes } = data;


    const clienteGrafica = [];

    mejoresClientes.map((cliente, index) => {
        clienteGrafica[index] = {
            ...cliente.cliente[0],
            total: cliente.total
        }
    })

    return ( 
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Mejores Clientes</h1>

            <BarChart
                className="mt-10"
                width={600}
                height={500}
                data={clienteGrafica}
                margin={{
                    top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="nombre" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total" fill="#3182CE" />
            </BarChart>
        </Layout>
     );
}
 
export default MejoresClientes;