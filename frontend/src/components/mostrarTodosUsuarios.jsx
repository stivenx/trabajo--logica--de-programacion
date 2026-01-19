import React, { useEffect, useState } from "react";
import apiClient from "../api/axiosConfig";
import { Link } from "react-router-dom";


const CategoriasMostrar = () => {
    const [users, setUsers] = useState([]);
    const[selectedUser, setSelectedUser] = useState([]);
    const [allusers, setAllUsers] = useState([]);
  
    useEffect(() => {
      
  
      console.log("Ejecutando fetchCategorias"); // Agrega un console.log aquí
      fetchCategorias();
      fectUsauariosTodos();
    }, []);

    const fetchCategorias = async () => {
        try {
          const response = await apiClient.get("/usuarios/");
          console.log("Respuesta de la API:", response.data); // Agrega un console.log aquí
          setUsers(response.data.usuarios);
        } catch (err) {
          console.error( err.response.data.error);
        }
      };

    const fectUsauariosTodos =async () => {
      try {
        const response = await apiClient.get("/usuarios/");
        console.log("Respuesta de la API:", response.data); // Agrega un console.log aqui
        setAllUsers(response.data.usuarios);
      } catch (err) {
        console.error( err.response.data.error);
      }
    }

    const fectUsauariosDeterminados =async () => {
      try {
        const response = await apiClient.get("/usuarios/determinados",{params:{users:selectedUser.join(',')}});
        console.log("Respuesta de la API:", response.data); // Agrega un console.log aqui
        setUsers(response.data);
      } catch (err) {
        console.error( err.response.data.error);
      }
    }  

    const handleGetUsers =(user)=>{
     setSelectedUser((prev)=>
      prev.includes(user) ? prev.filter((id) => id !== user) : [...prev, user]
   
    );
    }
   
    useEffect(() => {
      if(selectedUser.length > 0){
        fectUsauariosDeterminados();
      }else{
        fetchCategorias();
      }
    })
    console.log("Renderizando componente Categorias"); // Agrega un console.log aquí
  
    return (
  <div className="px-4">
    <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
      Usuarios
    </h1>

    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
     {allusers.length > 0 && (
       <div className="flex items-center">
        {allusers.map((user) => (
          <div key={user.id} className="mr-2">
            <input
              type="checkbox"
              id={user.id}
              value={user.id}
              checked={selectedUser.includes(user.id)}
              onChange={(e) => {
                
                  handleGetUsers(user.id);
               
                
              }}
            />
            <label htmlFor={user.id} className="ml-2">
              {user.nombre}
            </label>
          </div>
        
          
        ))}
        </div>
       
     )}

     
     
      {users.map((user) => (
        <li
          key={user.id}
          className="bg-white shadow-md rounded-xl p-5 hover:shadow-xl transition-all duration-300 border border-gray-100"
        >
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold rounded-full shadow">
              {user.nombre?.charAt(0).toUpperCase()}
            </div>
            <div className="ml-3">
              <p className="text-lg font-semibold text-gray-800">{user.nombre}</p>
              <p className="text-sm text-gray-500">{user.rol}</p>
            </div>
          </div>

          <div className="space-y-2 text-sm text-gray-700">
            <p>
              <span className="font-semibold">ID:</span> {user.id}
            </p>
            <p>
              <span className="font-semibold">Correo:</span> {user.correo}
            </p>
            <p>
              <span className="font-semibold">Dirección:</span> {user.direccion}
            </p>
            <p>
              <span className="font-semibold">Teléfono:</span> {user.telefono}
            </p>
          </div>

          <Link
            to={`/usuarios/${user.id}`}
            className="block mt-4 text-center bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all"
          >
            Ver detalles
          </Link>
        </li>
      ))}
    </ul>
  </div>
);

  };
export default CategoriasMostrar;

