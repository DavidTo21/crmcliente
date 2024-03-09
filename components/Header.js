import React from 'react';
import { useQuery, gql } from '@apollo/client'
import { useRouter } from 'next/router';

const OBTENER_USUARIO = gql`
    query ObtenerUsuario {
        obtenerUsuario {
            id
            nombre
            apellido
        }
    }
`;

const Header= () => {

    const router = useRouter();

    //QUERY DE APOLLO
    const { data, loading, error } = useQuery(OBTENER_USUARIO);
    // console.log(data);
    // console.log(loading);
    // console.log(error);

    //PROTEGER QUE NO SE ACCEDA A DATA ANTES DE OBTENER RESULTADOS
    if(loading) return null;

    //SI NO HAY INFORMACION
    if(!data) {
        return router.push('login');
    }

    const { nombre, apellido } = data.obtenerUsuario;

    const cerrarSesion = () => {
        const token = localStorage.removeItem('token');
        router.push('/login');
    }

    return (
        <div className='sm:flex justify-between mb-6'>
            <p className='mr-2 mb-5 lg:mb-0'>Hola: {nombre} {apellido}</p>

            <button
                onClick={() => cerrarSesion()} 
                type='button'
                className='bg-blue-800 w-full sm:w-auto font-bold uppercase text-xs rounded py-1 px-2 text-white shadow'
            >
                Cerrar Sesion
            </button>
        </div>
        
    )
}

export default Header;