import {useContext} from "react";
import { Routes, Route,Router } from "react-router-dom";
import Header from "./Header";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Productos from "./Productos";
import CarritoPage from "./carrito"; 
import  DetalleProducto from "./producto"; 
import Categorias from "./categorias";
import CatagoryProduct from "./productsCategori"
import  CategoriasMostrar from "./mostrarTodosUsuarios"
import ProductsCreate from "./productsCreate";
import Products from "./products";
import ProductDetail from "./productDetail";
import ProductsUpdate from "./productsUpdated";
import ProductsSelectCategori from "./productusCategoriSelect";
import  ProductsSelect from "./productsSelect"
import SearchProducts from "./searchProducts";
import {TitleProvider} from "../context/titleContext"
import {UserProvider} from "../context/useContext"
import {LogoutPorvider} from "../context/logoutContext"
import LogoutModal from "../context/logoutModal";
import {CarProvider} from "../context/carContext"
import CartPage from "./cartPage";
import CartModal from "../context/cartModal";

const App = () => {
  return (
    <div>
      
      <UserProvider>
      <CarProvider>
      <TitleProvider>
      <CartModal />
     
      <LogoutPorvider>
      
      <Header />
      
      <LogoutModal />   
      
      <Routes>
        
        
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/productos" element={<Productos />} />
        <Route path="/carrito" element={<CarritoPage />} />
        <Route path="/productos/:id" element={<DetalleProducto />} />
        <Route path="/categorias" element={<Categorias />} />
        <Route path="/categorias/:id" element={<CatagoryProduct />} />
        <Route path="/mostrarTodasCategori" element={<CategoriasMostrar />} />
        <Route path="/products/create" element={<ProductsCreate />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/products/update/:id" element={<ProductsUpdate />} />
        <Route path="/products/select" element={<ProductsSelectCategori />} />
        <Route path="/products/select/view" element={<ProductsSelect />} />
        <Route path="products/search" element={<SearchProducts />} />
        <Route path="/cart" element={<CartPage />} />
       
      </Routes>
      </LogoutPorvider>
    
      
      </TitleProvider>
      </CarProvider>
      </UserProvider>
    </div>
  );
};

export default App;