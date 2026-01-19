import { useContext,useRef,useEffect } from "react";
import { LogoutContext } from "../context/logoutContext";

const LogoutModal = () => {
  const { logoutVsible, handleLogoutInvisible, handleLogout } =
    useContext(LogoutContext);
    const modalRef = useRef(null);

    useEffect(()=>{
         const handleBotons =(e)=>{
            if(modalRef.current && !modalRef.current.contains(e.target)){
                
                handleLogoutInvisible();
            }
         }

         document.addEventListener("mousedown", handleBotons);
         return ()=>{
            document.removeEventListener("mousedown", handleBotons);
         }
    },[logoutVsible])

  if (!logoutVsible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div ref={modalRef} className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6 animate-scale">

        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-red-600">
            ⚠️ Cerrar sesión
          </h2>
          <button
            onClick={handleLogoutInvisible}
            className="text-gray-400 hover:text-gray-600 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <p className="text-gray-600 text-center mb-6">
          ¿Estás seguro de que deseas cerrar sesión?
        </p>

        {/* Footer */}
        <div className="flex justify-center gap-3">
          <button
            onClick={handleLogoutInvisible}
            className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
          >
            Cancelar
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
