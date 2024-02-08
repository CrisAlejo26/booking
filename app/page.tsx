"use client";
import { useAppDispatch } from "@/store/store";
import { thunkBockingState } from "@/thunks/thunkBockingState";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import * as XLSX from "xlsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { Container} from "react-bootstrap";
import { Toaster, toast } from 'sonner'
type ExcelRow = (string | number | boolean)[];



const Home = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    let informacion: any[] = [];
    const [reservas, setReservas] = useState<any[]>([]);
    const [pagoBocking, setPagoBocking] = useState<any[]>([]);
    const [payCar, setPayCar] = useState<any[]>([]);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, tipoArchivo: string) => {
            const file = e.target.files?.[0];
            if (!file) return;

            // const validExtensions = ['.xlsx', '.xls'];
            // const fileExtension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
            // if (!validExtensions.includes(fileExtension)) {
            //     alert('Por favor, sube un archivo de Excel.');
            //     return;
            // }

            const reader = new FileReader();
            reader.onload = (e: any) => {
            const ab = e.target.result;
            const wb = XLSX.read(ab, { type: "array" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { defval: "" }) as ExcelRow[];
            const informacion = data.map((reserva) => Object.values(reserva));
            if (tipoArchivo === "reservas") {
                setReservas(informacion);
            } else if (tipoArchivo === "pagoBocking") {
                setPagoBocking(informacion);
            } else if (tipoArchivo === "payCar") {
                setPayCar(informacion);
            }
            };
            reader.readAsArrayBuffer(file);
        };

    const onClick = async () => {

        // Verificar si todos los archivos han sido cargados
        if (reservas.length === 0 || pagoBocking.length === 0 || payCar.length === 0) {
            let mensajeFaltante = 'Falta por subir los siguientes archivos: ';
            if (reservas.length === 0) mensajeFaltante += ' Reservas ';
            if (pagoBocking.length === 0) mensajeFaltante += ' Pago Bocking';
            if (payCar.length === 0) mensajeFaltante += ' Pago con tarjeta ';

            toast.error(mensajeFaltante);
            return;
        }

        try {
            await dispatch(
                thunkBockingState({
                    pagoBocking: pagoBocking,
                    reservas: reservas,
                    payCar: payCar,
                })
                );
                router.push("/dashboard");
        } catch (error) {
            console.log(error);
        }
    };

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
            {pagoBocking.length > 1 && <p>Archivo de boking subido</p>}
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
