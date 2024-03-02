import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik} from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router';

const NUEVO_CLIENTE = gql`
    mutation Mutation($input: ClienteInput) {
        nuevoCliente(input: $input) {
            id
            nombre
            apellido
            empresa
            email
            telefono
        }
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

const NuevoCliente = () => {

    const router = useRouter();

    //STATE PARA EL MENSAJE
    const [mensaje, guardarMensaje] = useState(null);

    //MUTATION PARA AGREGAR CLIENTE
    const [nuevoCliente] = useMutation(NUEVO_CLIENTE, {
        update(cache, { data: { nuevoCliente } } ) {
            //OBTENER EL OBJETO DE CACHE QUE SE DESEA ACTUALIZAR DE
            const { obtenerClientesVendedor } = cache.readQuery({ query: OBTENER_CLIENTES_USUARIO});

            //REESCRIBIR EL CACHE (EL CACHE NUNCA SE DEBE MODIFICAR)
            cache.writeQuery({
                query:  OBTENER_CLIENTES_USUARIO,
                data: {
                    obtenerClientesVendedor : [...obtenerClientesVendedor, nuevoCliente ]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            empresa: '',
            email: '',
            telefono: ''
        },
        validationSchema: Yup.object({
            nombre: Yup.string()     
                       .required('El nombre del cliente es obligatorio.'),
            apellido: Yup.string()
                         .required('El apellido del cliente es obligatorio'),
            empresa: Yup.string()
                        .required('La empresa es obligatorio'),
            email: Yup.string()
                          .email('Correo invalido.')
                          .required('El email es obligatorio.'),
        }),
        onSubmit: async valores => {
            const { nombre, apellido, empresa, email, telefono } = valores
            try {
                const { data } = await nuevoCliente({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            empresa,
                            email,
                            telefono
                        }
                    }              
                });
                router.push('/');
            } catch (error) {
                guardarMensaje(error.message);

                setTimeout(() => {
                    guardarMensaje(null);
                },2000);
            }
        }
    });

    const mostrarMensaje = () => {
        return (
            <div className='bg-white py-2 px-3 w-full my-3 max-w-sm text-centar mx-auto'>
                <p>{mensaje}</p>
            </div>
        )
    }

    return (   
        <Layout>
             <h1 className="text-2xl text-gray-800 font-light">Nuevo Cliente</h1>

             {mensaje && mostrarMensaje()}

             <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <form
                        className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                        onSubmit={formik.handleSubmit}
                    >
                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                Nombre
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='nombre' 
                                type='text' 
                                placeholder='Nombre Cliente'
                                onChange={formik.handleChange}
                                onBlur={ formik.handleBlur }
                                value={formik.values.nombre}
                            />
                       </div>

                       { formik.touched.nombre && formik.errors.nombre ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.nombre}</p>
                                     </div>   
                        ) : null }

                       <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='apellido'>
                                Apellido
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='apellido' 
                                type='text' 
                                placeholder='Apellido Cliente'
                                onChange={formik.handleChange}
                                onBlur={ formik.handleBlur }
                                value={formik.values.apellido}
                            />
                       </div>

                       { formik.touched.apellido && formik.errors.apellido ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.apellido}</p>
                                     </div>   
                        ) : null }

                       <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='empresa'>
                                Empresa
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='empresa' 
                                type='text' 
                                placeholder='Empresa Cliente'
                                onChange={formik.handleChange}
                                onBlur={ formik.handleBlur }
                                value={formik.values.empresa}
                            />
                       </div>

                       { formik.touched.empresa && formik.errors.empresa ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.empresa}</p>
                                     </div>   
                        ) : null }

                       <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='email' 
                                type='email' 
                                placeholder='Email Cliente'
                                onChange={formik.handleChange}
                                onBlur={ formik.handleBlur }
                                value={formik.values.email}
                            />
                       </div>

                       { formik.touched.email && formik.errors.email ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.email}</p>
                                     </div>   
                        ) : null }

                       <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='telefono'>
                                Telefono
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='telefono' 
                                type='tel' 
                                placeholder='Teléfono Usuario'
                                onChange={formik.handleChange}
                                onBlur={ formik.handleBlur }
                                value={formik.values.telefono}
                            />
                       </div>

                       <input type='submit' className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900' value='Registrar Cliente'/>
                    </form>
                </div>
             </div>
        </Layout>
    ) ;       
}


export default NuevoCliente;