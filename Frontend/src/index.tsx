import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import {CssBaseline, ThemeProvider} from "@mui/material";
import theme from "./theme";
import Provider from "./context/Provider";
import {setContext} from "@apollo/client/link/context";
import {ApolloClient, ApolloLink, ApolloProvider, InMemoryCache} from "@apollo/client";
import {createUploadLink} from "apollo-upload-client"

const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = window.localStorage.getItem('token')
    // return the headers to the context so httpLink can read them
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "Bearer NO_TOKEN"
        }
    }
});

const uploadLink =  createUploadLink({uri: 'https://foyer-administration.herokuapp.com/graphql'})

const client = new ApolloClient({
    link: ApolloLink.from([authLink, uploadLink]),
    cache: new InMemoryCache()
});

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
    <React.StrictMode>
        <ApolloProvider client={client}>
            <Provider>
                <ThemeProvider theme={theme}>
                    <CssBaseline />
                    <App />
                </ThemeProvider>
            </Provider>
        </ApolloProvider>
    </React.StrictMode>
);

