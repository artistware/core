/// <reference path="./types/common.d.ts" />
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import { Provider } from 'react-redux';
// import App from './App';
import * as serviceWorker from './serviceWorker';
import {
    gql
} from 'apollo-boost';
import { ApolloClient } from 'apollo-client';
import {createHttpLink} from 'apollo-link-http';
import { ApolloProvider, Query } from 'react-apollo';
import * as ReactApolloTypes from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';

(async () => {
    const link = createHttpLink({
        uri: 'http://localhost:4000/graphql',
        credentials: 'include',
        headers: {
            accept: 'application/json',
            'content-type': 'application/json'
        }
    });

    const client = new ApolloClient({
        link,
        cache: new InMemoryCache()
    });

    // function repositoryReducer(state, action) {
    //     switch (action.type) {
    //       case 'TOGGLE_SELECT_REPOSITORY': {
    //         return applyToggleSelectRepository(state, action);
    //       }
    //       default:
    //         return state;
    //     }
    //   }

    const initialState = {};
    // const store = createStore(
    //     combineReducers({
    //     //   todos: todoReducer,
    //     //   users: userReducer,
    //     //   apollo: client.reducer(),
    //     }),
    //     initialState, // initial state
    //     compose(
    //         (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : (() => null),
    //     )
    // );
    
    try {
        const result = await client.mutate({
            mutation: gql`
                mutation {
                    login(email: "brmorrison61@gmail.com", password: "password") {
                        path
                        message
                        success
                    }
                }
            `
        });
        console.log(result);
    } catch (e) {
        console.log(e);
    }
    
    const meQuery = gql`{ 
        me { 
            sub,
            app_metadata {
                roles
            }
        }
    }`;
    
    // TODO sharable types amongst packages
    const Me = () => (
        <Query
            query={meQuery}>
            {
                ({ loading, error, data }: ReactApolloTypes.QueryResult) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    const { me } = data;
                    const { app_metadata } = me;
                    return (
                        <div>
                            {me.sub} | 
                            {app_metadata.roles.map((role:string, i:number) => (<p key={`role-${i}`}>{role}</p>))}
                        </div>
                    );
                }
            }
        </Query>
    )
    
    const ROOT = () => (
        <ApolloProvider client={client}>
            {/* <Provider store={}> */}
                <Me/>
            {/* </Provider> */}
        </ApolloProvider>
    );
    
    ReactDOM.render( <ROOT/>, document.getElementById('root'));
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
})();
