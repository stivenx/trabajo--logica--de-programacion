import { useState,useEffect,createContext } from "react";

export const UserContext = createContext();

 const userHandle = () =>{
    const token = localStorage.getItem("token");
    if(!token) return null;
   try {
    const playoud = JSON.parse(atob(token.split('.')[1]));
    return playoud.id
   } catch (error) {
     console.log("no se pudo obtener el id");
     return null
   }

 }



export const UserProvider = ({children}) =>{ 
    const [user, setUser] = useState(userHandle);
     
    useEffect(()=>{

        const handleId =()=>{
            setUser(userHandle());
        }
        window.addEventListener("storage", handleId);
        window.addEventListener("authChange", handleId);
        return ()=>{
            window.removeEventListener("storage", handleId);
            window.removeEventListener("authChange", handleId);
        }

    },[])



    return(
         <UserContext.Provider value={{user, setUser}}>{children}</UserContext.Provider>
        
        )
}