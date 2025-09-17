import { Product } from "@/interfaces";
import { servicesApi } from "@/services";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";




export const getAllproducts = createAsyncThunk("products/getAllProducts", async ()=>{
    const {data} = await servicesApi.getAllProducts()
    return data
})


const initialState:{products:Product[]} ={
 products:[]
}

const productsSlice = createSlice({
    name:"products",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder.addCase(getAllproducts.pending,()=>{
            console.log("pending");
        })
        builder.addCase(getAllproducts.rejected,()=>{
            console.log("rejected");
        })
        builder.addCase(getAllproducts.fulfilled,(state , action)=>{
            console.log("fulfilled");
            state.products = action.payload;
            console.log(action.payload)
        })
    }
})



export const productReducer= productsSlice.reducer;