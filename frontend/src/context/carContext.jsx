import { useState,useEffect,createContext,useContext } from "react";
import apiClient from "../api/axiosConfig";
import { UserContext } from "./useContext";

export const CarContext = createContext();


export const CarProvider = ({children}) => {
    const [carrito,setCarrito] = useState([]);
    const [visible,setVisible] = useState(false);
    const {user} = useContext(UserContext);
  
    useEffect(()=>{
        if(user){
            handleCart(user);
        }else{
            setCarrito([]);
        }
    },[user])

    const visibleActive =()=>{
        setVisible(!visible);
    }

    const handleCart =async(user)=>{
        if(!user){
            return
        }
        try {
            const response = await apiClient.get(`/carrito/${user}`);
            setCarrito(response.data);
            
        } catch (error) {
            console.error(error);
        }
    }

    const createCart =async(product,user,quantity)=>{
        try {
            const response = await apiClient.post(`/carrito/crear`,{
                 user_id:user
                 , product_id:product.id,
                 quantity:quantity
            });
            setCarrito(response.data);
           await  handleCart();
        } catch (error) {
            console.error(error);
        }
    }
    
    const handleEliminarProducto = async (cardId,product_id) => {
        try {
            await apiClient.delete(`/carrito/vaciarEspecifico/${cardId}/${product_id}`);
          await  handleCart(user);
        } catch (error) {
            console.error(error);
        }
        
    }

    const vaciarCarrito = async (cardId) => {
        try {
            await apiClient.delete(`/carrito/vaciar/${cardId}`);
           await handleCart(user);
        } catch (error) {
            console.error(error);
        }
    }

    const actualizarCarrito = async (cardId,product_id,quantity) => {
        try {
            await apiClient.put(`/carrito/actualizar`,{
                cardId:cardId,
                product_id:product_id,
                quantity:quantity
            });
            await handleCart(user);
        } catch (error) {
            console.error(error);
        }
    }
    return(
        <CarContext.Provider value={{carrito,visible,setVisible,visibleActive,createCart,handleCart,handleEliminarProducto,vaciarCarrito,actualizarCarrito,}}>
            {children}
        </CarContext.Provider>
    )
}

