// import { createContext, useContext, useEffect } from "react";



// const CartContextes = createContext({});

// export  function cartProvider({children}:{children:React.ReactNode}){

//     const [cartDetails, setCartDetails] = useState(null)

//     useEffect(()=>{
//         async function cartDetails(){
//         const data = await getUserCart()
//         setCartDetails(data)
//         }
//         cartDetails()
//     },[])

//     return(
//         <CartContextes.Provider value={{cartDetails}}>
//             {children}
//         </CartContextes.Provider>
//     )
// };

// export function userCart(){
//     const context = useContext(CartContextes)
//     console.log("🚀 ~ userCart ~ context:", context)
//     if(!context){
//         throw new Error('use cart must be used within a cart provider')
//     }
//     return context;
// }
