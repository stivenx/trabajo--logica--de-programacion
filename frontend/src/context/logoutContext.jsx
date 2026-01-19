import { createContext,useState } from "react";
import{useNavigate} from "react-router-dom"
export const LogoutContext = createContext();



export const LogoutPorvider =({children})=>{

    const [logoutVsible, setLogoutVisible] = useState(false);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        localStorage.removeItem("token");
        window.dispatchEvent(new Event("authChange"));
        navigate("/")
        setLogoutVisible(false);
    }

    const handleLogoutVisible = () => {
        setLogoutVisible(true);
    }

    const handleLogoutInvisible = () => {
        setLogoutVisible(false);
    }
    return(
    <LogoutContext.Provider value={{handleLogoutVisible, handleLogout, handleLogoutInvisible, logoutVsible}}>{children}</LogoutContext.Provider>)
}