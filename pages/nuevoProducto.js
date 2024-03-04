import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useFormik} from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client'
import { useRouter } from 'next/router';
import Swal from 'sweetalert2';

const NUEVO_PRODUCTO = gql`
    mutation NuevoProducto($input: ProductoInput) {
        nuevoProducto(input: $input) {
            nombre
            existencia
            precio
        }
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

const NuevoProducto = () => {

    const router = useRouter();

    //STATE PARA EL MENSAJE
    const [mensaje, guardarMensaje] = useState(null);

    //MUTATION PARA AGREGAR PRODUCTO
    const [nuevoProducto] = useMutation(NUEVO_PRODUCTO, {
        update(cache, { data: { nuevoProducto } } ) {
            //OBTENER EL OBJETO DE CACHE QUE SE DESEA ACTUALIZAR DE
            const { obtenerProductos } = cache.readQuery({ query: OBTENER_PRODUCTOS});

            //REESCRIBIR EL CACHE (EL CACHE NUNCA SE DEBE MODIFICAR)
            cache.writeQuery({
                query:  OBTENER_PRODUCTOS,
                data: {
                    obtenerProductos : [...obtenerProductos, nuevoProducto ]
                }
            })
        }
    });

    const formik = useFormik({
        initialValues: {
            nombre: '',
            existencia: 0,
            precio: 0,
        },
        validationSchema: Yup.object({
            nombre: Yup.string()     
                       .required('El nombre del producto es obligatorio.'),
            existencia: Yup.number()
                         .required('La existencia del producto es obligatorio')
                         .positive('No se aceptan números negativos')
                         .integer('La existencia deben ser números enteros')
                         .moreThan(0, 'La existencia debe ser mayor a 0'),
            precio: Yup.number()
                        .required('El precio es obligatorio')
                        .positive('No se aceptan números negativos')
                        .moreThan(0,'El precio debe ser mayor a 0'),
        }),
        onSubmit: async valores => {
            const { nombre, existencia, precio } = valores
            try {
                const { data } = await nuevoProducto({
                    variables: {
                        input: {
                            nombre,
                            existencia,
                            precio
                        }
                    }              
                });
                //MOSTRAR ALERTA
                Swal.fire({
                    title: "Producto nuevo!",
                    text: "Producto agregado correctamente",
                    icon: "success"
                  });
                router.push('/productos');
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
            <h1 className="text-2xl text-gray-800 font-light">Nuevo Producto</h1>

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
                                placeholder='Nombre Producto'
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
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='existencia'>
                                Existencia
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='existencia' 
                                type='number' 
                                placeholder='Existencia Producto'
                                onChange={formik.handleChange}
                                onBlur={ formik.handleBlur }
                                value={formik.values.existencia}
                            />
                       </div>

                       { formik.touched.existencia && formik.errors.existencia ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.existencia}</p>
                                     </div>   
                        ) : null }

                       <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='precio'>
                                Precio
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='precio' 
                                type='number' 
                                placeholder='Precio Producto'
                                onChange={formik.handleChange}
                                onBlur={ formik.handleBlur }
                                value={formik.values.precio}
                            />
                       </div>

                       { formik.touched.precio && formik.errors.precio ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.precio}</p>
                                     </div>   
                        ) : null }

                       <input type='submit' className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900' value='Registrar Producto'/>
                    </form>
                </div>                
            </div>
        </Layout>
    );
}

export default NuevoProducto;