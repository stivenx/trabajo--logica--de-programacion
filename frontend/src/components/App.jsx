import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Productos from "./Productos";
import CarritoPage from "./carrito"; 
import  DetalleProducto from "./producto"; 
import Categorias from "./categorias";
import CatagoryProduct from "./productsCategori"

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:id" element={<CatagoryProduct />} />
       
      </Routes>
    </div>
  );
};

export default App;