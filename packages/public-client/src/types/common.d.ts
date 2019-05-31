export interface MyWindow extends Window {
    __REDUX_DEVTOOLS_EXTENSION__: Function;
}

declare global {
    interface Window{
        __REDUX_DEVTOOLS_EXTENSION__: Function
    }
}
