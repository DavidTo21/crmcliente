import React, { useContext, useState } from 'react';
import Layout from '../components/Layout';
import AsignarCliente from '../components/Pedidos/AsignarCliente';
import AsignarProductos from '../components/Pedidos/AsignarProductos';
import ResumenPedido from '../components/Pedidos/ResumenPedido';
import Total from '../components/Pedidos/Total';
import { gql, useMutation } from '@apollo/client';
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

//CONTEXT DE PEDIDOS
import PedidoContext from '../context/pedidos/PedidoContext';

const NUEVO_PEDIDO = gql`
    mutation NuevoPedido($input: PedidoInput) {
        nuevoPedido(input: $input) {
            id
        }
    }
`;

const NuevoPedido = () => {

    const router = useRouter();

    const [mensaje, setMensaje] = useState(null);

    //Utilizar context y extraer sus funciones y valores
    const pedidoContext = useContext(PedidoContext);
    const { cliente, productos, total} = pedidoContext;

    //Mutation para crear un nuevo pedido
    const [ nuevoPedido ] = useMutation(NUEVO_PEDIDO)
    
    const validarPedido = () => {
        return !productos.every( producto => producto.cantidad > 0) || total === 0 || cliente.length === 0 ? " opacity-50 cursor-not-allowed "  : "" ;
    }
 
    const crearNuevoPedido = async () => {

        const { id } = cliente;

        //Remover lo no deseado del producto
        const pedido = productos.map( ( { __typename,existencia, creado, ...producto } ) => producto )

        try {
            const { data } = await nuevoPedido({
                variables:{
                    input: {
                        cliente: id,
                    total: total,
                    pedido
                    }                  
                }
            });
            // console.log(data);
            
            //Redireccionar
            router.push('/pedidos');

            //Mostrar alerta
            Swal.fire({
                title: "Pedido nuevo!",
                text: "Pedido generado correctamente",
                icon: "success"
              });
        } catch (error) {
            setMensaje(error.message);
            setTimeout(() => {
                setMensaje(null);
            },2000);
        }
    }

    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-center mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Pedido</h1>

            { mensaje && mostrarMensaje() }

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <AsignarCliente/>
                    <AsignarProductos/>
                    <ResumenPedido/>
                    <Total/>
                    
                    <button
                        type='button'
                        className={` bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900 ${validarPedido()}`}
                        onClick={ () => crearNuevoPedido()}
                    >Registrar pedido</button>
                </div>
            </div>
            
        </Layout>
     
    );
}

export default NuevoPedido;