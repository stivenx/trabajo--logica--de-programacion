import { useState,useEffect,createContext } from "react";
import titles from "./titles";
import { useLocation } from "react-router-dom";
export const TitleContext = createContext();



export const TitleProvider = ({children}) => {
    const location = useLocation();
    const nombreTitulo =   titles[location.pathname] ?? "tienda";
    const [title,setTitle] = useState(nombreTitulo);

  useEffect(()=>{
    document.title = title

  },[title])


  useEffect(()=>{
      if(titles[location.pathname]){
          setTitle(titles[location.pathname])
      }
  },[location.pathname])
    return (
        <TitleContext.Provider value={{setTitle}}>
            {children}
        </TitleContext.Provider>
    )
}