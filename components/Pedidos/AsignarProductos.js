import React, { useEffect, useState, useContext } from 'react';
import Select from 'react-select';
import { gql, useQuery } from '@apollo/client';
import PedidoContext from '../../context/pedidos/PedidoContext';

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

const AsignarProductos = () => {

    //State local del componente
    const [productos, setProductos] = useState([]);

    //Context de pedidos
    const pedidoContext = useContext(PedidoContext);
    const { agregarProducto } = pedidoContext;

    //Consulta a la base de datos
    const { data, loading, errror } = useQuery(OBTENER_PRODUCTOS);

    useEffect(() => {
        //TODO: Funcion para pasar a PedidoSatate
        agregarProducto(productos);
    }, [productos])

    const seleccionarProducto = producto => {
        setProductos(producto);
    }

    if (loading) return null;

    const { obtenerProductos } = data;

    return (
        <>
            <p className='mt-10 my-2 bh-white border-l-4 border-gray-800 text-gray-700 p-2 text-sm font-bold'>2.- Selecciona los producto(s)</p>
            <Select
                className="mt-3"
                options={ obtenerProductos }
                onChange={opcion=> seleccionarProducto(opcion)}
                isMulti = {true}
                getOptionValue={opciones => opciones.id }
                getOptionLabel={opciones => `${opciones.nombre } - ${opciones.existencia} Disponibles`}
                placeholder= 'Seleccione el producto(s)'
                noOptionsMessage={ () => "No hay resultados"}
            />
        </>
    );
}

export default AsignarProductos;

