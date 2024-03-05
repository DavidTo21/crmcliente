import React, { useState, useEffect } from 'react';

const Pedido = ({pedido}) => {

    const { id, total, cliente, estado} = pedido;

    const [ estadoPedido, setEstadoPedido] = useState(estado);

    useEffect(() => {
        if(estadoPedido){
            setEstadoPedido(estadoPedido);
        };
    }, [estadoPedido]);

    return (
        <div className='mt-4 bg-white rounded p-6 md:frid md:grid-cols-2 md:gap-4 shadow-lg'>
            <div>
                <p className='font-bold text-gray-800'>Cliente: {cliente}</p>

                <h2 className='text-gray-800 font-bold mt-10'>Estado Pedido:</h2>

                <select
                   className='mt-2 appearance-none bg-blue-800 border border-blue-600 text-white p-2 text-center rounded leading-tight focus:outline-none focus:bg-blue-600 focus:border-blue-500 uppercase text-xs font-bold' 
                    value={estadoPedido}
                >
                    <option value='COMPLETADO'>COMPLETADO</option>
                    <option value='PENDIENTE'>PENDIENTE</option>
                    <option value='CANCELADO'>CANCELADO</option>
                </select>
            </div>

            <div className='text-gray-800 font-bold mt-2'>
                <h2>Resumen del pedido</h2>
            </div>
        </div>
    );
}

export default Pedido;