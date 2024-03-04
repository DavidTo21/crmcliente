import React from "react";
import Swal from 'sweetalert2';
import { useMutation, gql } from "@apollo/client";
import Router from "next/router";

const ELIMINAR_PRODUCTO = gql`
    mutation Mutation($id: ID!) {
        eliminarProducto(id: $id)
    }
`;

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

const Producto = ({ producto }) => {

    //MUTATION 
    const [eliminarProducto] = useMutation(ELIMINAR_PRODUCTO,{
        update(cache) {
            //OBTENER UNA COPIA DE LA CACHE
            const  { obtenerProductos } = cache.readQuery( { query: OBTENER_PRODUCTOS });
            //REESCRIBIR A CACHE
            cache.writeQuery({
                query: OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos: obtenerProductos.filter(cliente => cliente.id!== id)
                }
            })
        }
    });

    const { nombre, existencia, precio, id} = producto;

    const confirmarEliminarProducto = () => {
        Swal.fire({
            title: "¿Desea eliminar a este producto?",
            text: "Esta acción no se puede deshacer",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, eliminar",
            cancelButtonText: "Cancelar",
          }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    //ELIMINAR POR ID
                    const { data } = await eliminarProducto({
                        variables: {
                            id
                        }
                    });
                    //MOSTRAR ALERTA
                    Swal.fire({
                        title: "Eliminado!",
                        text: data.eliminarProducto,
                        icon: "success"
                      });
                } catch (error) {
                    console.error(error);
                }
              
            }
          });
    }

    //Funcion editar cliente
    const editarProducto = () => {
        Router.push({
            pathname: '/editarProducto/[id]',
            query: {
                id
            }
        })
    }
    
    return (
        <tr>
            <td className="border px-4 py-2">{nombre}</td>
            <td className="border px-4 py-2">{existencia} Pzas.</td>
            <td className="border px-4 py-2">$ {precio}</td>
            <td className="border px-4 py-2">
                <button 
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase" 
                    type="button"
                    onClick={() => confirmarEliminarProducto() }
                >
                        Eliminar
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                </button>
            </td>
            <td className="border px-4 py-2">
                <button 
                    className="flex justify-center items-center bg-green-600 py-2 px-4 w-full text-white rounded text-xs uppercase" 
                    type="button"
                    onClick={() => editarProducto() }
                >
                        Editar
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                        </svg>

                </button>
            </td>
        </tr>
    );
}

export default Producto;