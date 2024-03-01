import { ApolloClient, createHttpLink, InMemoryCache } from '@apollo/client';
import fetch  from 'node-fetch';
import { setContext } from 'apollo-link-context';
import { REACT_LOADABLE_MANIFEST } from 'next/dist/shared/lib/constants';

const HttpLink = createHttpLink({
    uri: 'http://localhost:4000/',
    fetch
});

const authLink = setContext((_,{ headers })=> {
    //LEER EL STORAGE ALAMCENADO
    const token = localStorage.getItem('token');

    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : ''
        }
    }
}) ;

const client = new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(HttpLink)
});

export default client;