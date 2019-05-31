/// <reference path="./types/common.d.ts" />
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import { createStore, combineReducers, compose, bindActionCreators } from 'redux';
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
    

    // TODO all payloads should be typescript assured
    function userReducer(state = { isAuth: false, info: null }, action: { type:string, payload?: any }) {
        switch (action.type) {
            case 'USER_IDENTITY_LOGIN':
                return { ...state, isAuth: true }; // successful login
            case 'USER_IDENTITY_ME':
                const { payload } = action;
                return { isAuth: true, info: payload }; // successful me check
            case 'USER_IDENTITY_LOGOUT':
                return { isAuth: false, info: null };
            default:
                return state;
        }
    }

    const userIdentityLogin = () => ({type: 'USER_IDENTITY_LOGIN'});
    const userIdentityMe = (payload) => ({type: 'USER_IDENTITY_ME', payload});
    const userIdentityLogout = () => ({type: 'USER_IDENTITY_LOGOUT'});

    const initialState = {};
    const store = createStore(
        combineReducers({
            user: userReducer
        }),
        initialState, // initial state
        compose(
            (typeof window.__REDUX_DEVTOOLS_EXTENSION__ !== 'undefined') ? window.__REDUX_DEVTOOLS_EXTENSION__() : (() => null),
        )
    );

    const userIdentity$ = bindActionCreators({
        login: userIdentityLogin,
        me: userIdentityMe,
        logout: userIdentityLogout
    }, store.dispatch);

    
    try {
        await client.mutate({
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
        userIdentity$.login();
    } catch (e) {
        // TODO msging to toast a reducer
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
    // TODO <Query... seems awful considering it should just receive props...  the QueryResult is the "props" in this situation
    // let MeRenderCount = 0;
    const Me = () => (
        <Query
            query={meQuery}>
            {
                ({ loading, error, data }: ReactApolloTypes.QueryResult) => {
                    if (loading) return <p>Loading...</p>;
                    if (error) return <p>Error :(</p>;
                    
                    const { me } = data;
                    const { app_metadata } = me;
                    userIdentity$.me(me);
                    return (
                        <h3>{me.sub} | {app_metadata.roles.map((role:string, i:number) => (<span key={`role-${i}`}>{role}</span>))}</h3>
                    );
                }
            }
        </Query>
    )
    
    const ROOT = () => (
        <ApolloProvider client={client}>
            <Provider store={store}>
                <Me/>
            </Provider>
        </ApolloProvider>
    );
    
    ReactDOM.render( <ROOT/>, document.getElementById('root'));
    
    // If you want your app to work offline and load faster, you can change
    // unregister() to register() below. Note this comes with some pitfalls.
    // Learn more about service workers: https://bit.ly/CRA-PWA
    serviceWorker.unregister();
})();
