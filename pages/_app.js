import { ApolloProvider } from '@apollo/client';
import client from '../config/apollo';
import PedidoSate from '../context/pedidos/PedidoState';

const MyApp = ({ Component, pageProps}) => {
    console.log('Desde _app.js');
    return(
        <ApolloProvider client={client}>
            <PedidoSate>
                <Component {...pageProps} />
            </PedidoSate>
        </ApolloProvider>
    )
}

export default MyApp;