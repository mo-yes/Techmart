import { configureStore } from "@reduxjs/toolkit";
import { counterReducer } from "./slices/counterslice";
import { productReducer } from "./slices/productsslice";






 export const store = configureStore({
    reducer:{
        counter: counterReducer,
        products: productReducer
    }
})