import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import { useFormik} from 'formik';
import * as Yup from 'yup';
import { useMutation, gql } from '@apollo/client';

const NUEVA_CUENTA = gql`
mutation NuevoUsuario($input: UsuarioInput) {
  nuevoUsuario(input: $input) {
    id
    nombre
    apellido
    email
  }
}
 `;

const NuevaCuenta = () => {
    //STATE PARA EL MENSAJE
    const [mensaje, guardarMensaje] = useState(null); 

    //MUTATION PARA CREAR NUEVOS USUARIOS
    const [ nuevoUsuario ] = useMutation(NUEVA_CUENTA);

    //ROUTING
    const router = useRouter();

    //VALIDACION DEL FORMULARIO
    const formik = useFormik({
        initialValues: {
            nombre: '',
            apellido: '',
            email: '',
            password: '',
        },
        validationSchema: Yup.object({
            nombre: Yup.string()
                       .required('Nombres(s) es obligatorio.'),
            apellido: Yup.string()
                         .required('Apellido(s) es obligatorio.'),
            email: Yup.string()
                      .email('Email no es valido')
                      .required('Email es obligatorio.'),
            password: Yup.string()
                     .required('Password no puede estar vacio.')
                     .min(6,'Password debe ser de al menos 6 carácteres.'),
        }),
        onSubmit: async valores => {
            //console.log('enviando');
            //console.log(valores);
            const { nombre, apellido, email, password } = valores

            try {
                const { data } = await nuevoUsuario ({
                    variables: {
                        input: {
                            nombre,
                            apellido,
                            email,
                            password
                        }
                    }
                });
                console.log(data);
                //USUARIO CREADO CORRECTAMENTE
                guardarMensaje(`Se creo correctamente el usuario: ${data.nuevoUsuario.nombre} `);
                //REDIRIGIR AL LOGIN
                setTimeout(() => {
                    guardarMensaje(null);
                    router.push('/login');
                },3000);

            } catch (error) {
                guardarMensaje(error.message);

                setTimeout(() => {
                    guardarMensaje(null);
                },3000);
                console.log(error.message);
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
    <>
        <Layout>
            
            <h1 className='text-center text-2xl text-white font-light'>Crear Nueva Cuenta</h1>

            {mensaje && mostrarMensaje()}

            <div className='flex justify-center mt-5'>
                <div className='w-full max-w-sm'>
                    <form className='bg-white rounded shadow-md px-8 pt-6 pb-8 mb-4' onSubmit={formik.handleSubmit}>

                        <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='nombre'>
                                Nombre(s)
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='nombre' 
                                type='text' 
                                placeholder='Nombre(s) Usuario' 
                                value={formik.values.nombre} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
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
                                Apellido(s)
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='apellido' 
                                type='text' 
                                placeholder='Apellido(s) Usuario' 
                                value={formik.values.apellido} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                       </div>

                       { formik.touched.apellido && formik.errors.apellido ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.apellido}</p>
                                     </div>   
                        ) : null }

                       <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='email'>
                                Email
                            </label>
                            <input className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='email' 
                                type='email' 
                                placeholder='Email Usuario' 
                                value={formik.values.email} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                       </div>

                       { formik.touched.email && formik.errors.email ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.email}</p>
                                     </div>   
                        ) : null }

                       <div className='mb-4'>
                            <label className='block text-gray-700 text-sm font-bold mb-2' htmlFor='password'>
                                Password
                            </label>
                            <input 
                                className='bg-white shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline' 
                                id='password' 
                                type='password' 
                                placeholder='Password Usuario' 
                                value={formik.values.password} 
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                       </div>

                       { formik.touched.password && formik.errors.password ? (
                                    <div className='my-2 bg-red-100 border-l-4 border-red-500 text-red-700 p-4'>
                                        <p className='font-bold'>Error</p>
                                        <p>{formik.errors.password}</p>
                                     </div>   
                        ) : null }

                       <input type='submit' className='bg-gray-800 w-full mt-5 p-2 text-white uppercase hover:bg-gray-900' value='Crear Cuenta'>

                       </input>
                    </form>
                </div>
            </div>
        </Layout>
    </>
   );
}

export default NuevaCuenta;