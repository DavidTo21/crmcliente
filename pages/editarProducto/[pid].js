import React from "react";
import { useRouter } from "next/router";
import Layout from '../../components/Layout';
import { useQuery, gql, useMutation } from "@apollo/client";
import { Formik } from 'formik';
import * as Yup from 'yup';
import Swal from 'sweetalert2';

const OBTENER_PRODUCTO = gql`
  query ObtenerProducto($id: ID!) {
  obtenerProducto(id: $id) {
    id
    nombre
    existencia
    precio
  }
}
`;

const ACTUALIZAR_PRODUCTO = gql`
    mutation ActualizarProducto($id: ID!, $input: ProductoInput) {
    actualizarProducto(id: $id, input: $input) {
        nombre
        existencia
        precio
    }
}
`;

const EditarProducto = () => {

    //Obtener el ID actual
    const router = useRouter();
    const { query: { pid } }= router;

    //Consulta para obtener info del cliente
    const { data, loading, error } = useQuery(OBTENER_PRODUCTO,{
        variables: {
            id: pid
        }
    });

    //Actualizar el cliente
    const [ actualizarProducto ] = useMutation( ACTUALIZAR_PRODUCTO );

    //Schema de validacion

    const schemaValidacion = Yup.object({
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
    })

    if (loading) return 'Cargando...';

    if (!data) return 'Acción no permitida';

    console.log(data.obtenerProducto);

    const { obtenerProducto } = data;

    //Modifica el cliente en la BD
    const actualizarInfoProducto = async  valores => {
        const { nombre, existencia, precio} = valores;

        try {
            const { data } = await actualizarProducto({
                variables: {
                    id: pid,
                    input: {
                        nombre,
                        existencia,
                        precio
                    }
                }
            });

            //console.log(data);

            Swal.fire({
                title: "Actualizado!",
                text: "El producto se actualizó correctamente",
                icon: "success"
              });
            //Redireccionar
            router.push('/productos');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <Layout>
            <h1 className="text-2xl text-gray-800 font-light">Editar Producto</h1>

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-lg'>
                    <Formik
                        validationSchema={ schemaValidacion }
                        enableReinitialize
                        initialValues={ obtenerProducto }
                        onSubmit={ (valores) => {
                            actualizarInfoProducto(valores);
                        }}
                    >
                        { props => {
                            return (
                                <form
                                    className='bg-white shadow-md px-8 pt-6 pb-8 mb-4'
                                    onSubmit={props.handleSubmit}
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
                                            onChange={props.handleChange}
                                            onBlur={ props.handleBlur }
                                            value={props.values.nombre}
                                        />
                                    </div>

                                    { props.touched.nombre && props.errors.nombre ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.nombre}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={ props.handleBlur }
                                            value={props.values.existencia}
                                        />
                                    </div>

                                    { props.touched.existencia && props.errors.existencia ? (
                                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                        <p className='font-bold'>Error</p>
                                                        <p>{props.errors.existencia}</p>
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
                                            onChange={props.handleChange}
                                            onBlur={ props.handleBlur }
                                            value={props.values.precio}
                                        />
                                    </div>

                                        { props.touched.precio && props.errors.precio ? (
                                            <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                                <p className='font-bold'>Error</p>
                                                <p>{props.errors.precio}</p>
                                            </div>   
                                        ) : null }

                                    <input type='submit' className='bg-gray-800 w-full mt-5 p-2 text-white uppercase font-bold hover:bg-gray-900' value='Actualizar Producto'/>

                                </form>
                            )
                        } }
                    </Formik>
                </div>
            </div>
        </Layout>
    );
}

export default EditarProducto;