import React from "react"
import Listadologo from "../images/app-listado-logo.jpg"
import "../styles/SplashStyles.css"

const SplashScreen = () => {
    return (
        <div className="splash-screen">
            <img src={Listadologo} alt="Logo" className="splash-logo" />
            <h1 className="splash-logo">Cargando...</h1>
        </div>
    );
};

export default SplashScreen
