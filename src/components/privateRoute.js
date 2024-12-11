// src/presentation/components/PrivateRoute.js
import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user); // Vérifie si l'utilisateur est connecté

  // Si l'utilisateur n'est pas connecté, redirige vers la page de connexion
  if (!user) {
    return <Navigate to="/" />;
  }

  // Si l'utilisateur est connecté, affiche les enfants (la page demandée)
  return children;
};

export default PrivateRoute;
