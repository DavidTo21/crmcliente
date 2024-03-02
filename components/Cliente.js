import React from "react";
import Swal from 'sweetalert2';
import { useMutation, gql } from "@apollo/client";

const ELIMINAR_CLIENTE = gql`
    mutation eliminarCliente($id: ID!) {
        eliminarCliente(id:$id) 
    }
`;

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

const Cliente = ({ cliente }) => {

    //MUTATION 
    const [eliminarCliente] = useMutation(ELIMINAR_CLIENTE,{
        update(cache) {
            //OBTENER UNA COPIA DE LA CACHE
            const  { obtenerClientesVendedor } = cache.readQuery( { query: OBTENER_CLIENTES_USUARIO });
            //REESCRIBIR A CACHE
            cache.writeQuery({
                query: OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor: obtenerClientesVendedor.filter(cliente => cliente.id!== id)
                }
            })
        }
    });

    const { nombre, apellido, empresa, email, id} = cliente;

    const confirmarEliminarCliente = id => {
        Swal.fire({
            title: "¿Desea eliminar a este cliente?",
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
                    const { data } = await eliminarCliente({
                        variables: {
                            id
                        }
                    });
                    //MOSTRAR ALERTA
                    Swal.fire({
                        title: "Eliminado!",
                        text: data.eliminarCliente,
                        icon: "success"
                      });
                } catch (error) {
                    console.error(error);
                }
              
            }
          });
    }

    return (
        <tr>
            <td className="border px-4 py-2">{nombre} {apellido}</td>
            <td className="border px-4 py-2">{empresa}</td>
            <td className="border px-4 py-2">{email}</td>
            <td className="border px-4 py-2">
                <button 
                    className="flex justify-center items-center bg-red-800 py-2 px-4 w-full text-white rounded text-xs uppercase" 
                    type="button"
                    onClick={() => confirmarEliminarCliente(id) }
                >
                        Eliminar
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 ml-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                </button>
            </td>
        </tr>
    );
}

export default Cliente;