"use client";
import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Container} from "react-bootstrap";
import { useHome } from "@/hooks/useHome";

const Home = () => {

    const { handleFileUpload, reservas, pagoBocking, payCar, onClick } = useHome()

    return (
        <Container>
        <h1 className="fs-2 mt-6 mb-7">Subir Archivos</h1>
        <div className="flex justify-center gap-14 flex-wrap">
            <div>
            <input
                className="input"
                id="uploadReservas"
                placeholder="Importar Reservas"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, "reservas")}
            />
            <label className="label" htmlFor="uploadReservas">
                <h2>Reservas</h2>
                <FontAwesomeIcon icon={faUpload} style={{ color: "#ffffff" }} />
            </label>
            {reservas.length > 1 && <p>Archivo de reservas subido</p>}
            </div>
            <div>
            <input
                className="input"
                id="uploadBocking"
                placeholder="Importar Bocking"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, "pagoBocking")}
            />
            <label className="label" htmlFor="uploadBocking">
                <h2>Boking</h2>
                <FontAwesomeIcon icon={faUpload} style={{ color: "#ffffff" }} />
            </label>
            {pagoBocking.length > 0 && <p>Archivo de boking subido</p>}
            </div>
            <div>
            <input
                className="input"
                id="uploadTarjetas"
                placeholder="Importar Tarjetas"
                type="file"
                accept=".xlsx,.xls"
                onChange={(e) => handleFileUpload(e, "payCar")}
            />
            <label
                className="label"
                htmlFor="uploadTarjetas"
            >
                <h2>Pago con Tarjeta</h2>
                <FontAwesomeIcon icon={faUpload} style={{ color: "#ffffff" }} />
            </label>
            {payCar.length > 1 && <p className="text-center">Archivo de tarjetas subido</p>}
            </div>
        </div>
        <div className="d-grid gap-2">
            <button onClick={onClick} className="btn btn-outline-success mt-10 btn-lg h-16">Ingresar archivos</button>
        </div>
        </Container>
    );
};

export default Home;
