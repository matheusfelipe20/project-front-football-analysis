import React from "react";
import { Navigate } from "react-router-dom";

//Verifica se o usuário está autenticado
const isAuthenticated = () => {
  const token = localStorage.getItem("authToken");
  return Boolean(token); //Retorna true se o token existir
};

const PrivateRoute = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
