"use client"

import { useAppSelector } from '@/store/store'
import { Encontrada } from '@/thunks/thunkBockingState';
import React, { useEffect, useState } from 'react'
import { hourglass } from 'ldrs'
import { ClockLoader } from 'react-spinners'
import Button from '@mui/material/Button';
import Modal from './modal';

interface Pagos {
    coincidencias: Encontrada[],
    coincidenciasPayCar: Encontrada[],
    pagoBockingNoEncontrados: Encontrada[]
};

const Table = () => {

    const [showModal, setShowModal] = useState(false);

    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);

    const { coincidencias, coincidenciasPayCar, pagoBockingNoEncontrados }: Pagos = useAppSelector(state => state.bocking.pagos);
    const [colorFiltro, setColorFiltro] = useState('');

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if(!coincidencias) {
            return setLoading(true)
        }
        setLoading(false)
    }, [coincidencias])
    

    const handleColorChange = (e: any) => {
        setColorFiltro(e.target.value);
    };

    const coincidenciasConOrigen = coincidencias.map((item:any) => ({ ...item, origen: 'coincidencias', color: "payBocking" }));
    const coincidenciasPayCarConOrigen = coincidenciasPayCar.map(item => ({ ...item, origen: 'coincidenciasPayCar', color: "payBockingRed" }));
    const pagoBockingNoEncontradosConOrigen = pagoBockingNoEncontrados.map(item => ({ ...item, origen: 'pagoBockingNoEncontrados', color: "payBockingRed" }));

    const filasFiltradas = [
        ...coincidenciasConOrigen,
        ...coincidenciasPayCarConOrigen,
        ...pagoBockingNoEncontradosConOrigen
    ].filter(dato => {
        let sinPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta";
        let pagoBocking = dato.pagoReserva === dato.pagoBocking;
        let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;
        let pagoTarjetaSinImporteReservas = dato.reserva === "Esta en pagos con tarjeta pero no en reservas";
        let pagoBockingSinEncontrarEnReservas = dato.reserva === "Esta en pagos con bocking pero no en reservas"
        if (colorFiltro === "payBockingRed" && sinPago) return true;
        if (colorFiltro === "payBockingRed" && pagoBockingSinEncontrarEnReservas) return true
        if (colorFiltro === "payBockingRed" && pagoTarjetaSinImporteReservas) return true;
        if (colorFiltro === "payBocking" && (pagoBocking || pagoTargeta)) return true;
        if (colorFiltro === "payNothing" && !sinPago && !pagoBocking && !pagoTargeta) return true;
        if (colorFiltro === '') return true; // Muestra todos si no hay filtro

        return false;
    });

    const [checkedState, setCheckedState] = useState(
        filasFiltradas.map(rec =>  false)
    );

    const handleCheckboxChange = (position: any) => {
        // Actualiza el estado de los checkboxes
        const updatedCheckedState = checkedState.map((item, index) =>
            index === position ? !item : item
        );

        setCheckedState(updatedCheckedState);
    };
    
    hourglass.register()

    return (
        <>
        {loading ? <div className='flex justify-center align-center mt-14'><ClockLoader size={150} color="#3659d6" /></div> :
        
        <div className='container mt-5'>
            <div className="overflow-x-auto">
                <div className='w-2/4 mb-4'>
                    <select className="form-select" aria-label="Default select example" onChange={handleColorChange}>
                        <option value="">Selecciona un Color</option>
                        <option value="payNothing">Amarillo</option>
                        <option value="payBocking">Verde</option>
                        <option value="payBockingRed">Rojo</option>
                    </select>
                </div>
                <table className="min-w-full table-auto border-collapse border">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="px-4 py-2 border">N° de Reserva</th>
                            <th className="px-4 py-2 border">N° de boocking</th>
                            <th className="px-4 py-2 border">Pago de reserva</th>
                            <th className="px-4 py-2 border">Pago Bocking</th>
                            <th className="px-4 py-2 border">Pago con Tarjeta</th>
                            <th className="px-4 py-2 border">Pagos encontrados en tarjetas</th>
                            <th className="px-4 py-2 border">Estado</th>
                            <th className="px-4 py-2 border">Observaciones</th>
                            <th className="px-4 py-2 border">Accion</th>
                        </tr>
                    </thead>
                    <tbody>
                    {loading ? <ClockLoader size={150} color="#3659d6" />
                        :
                        filasFiltradas.map((dato, index) => {
                            let className;
                            let pagoExtraEstilo = dato.descripcion?.includes("el pago por") ? 'red' : null
                            if (dato.origen === 'coincidencias') {
                                let sinPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta";
                                let pagoBocking = dato.pagoReserva === dato.pagoBocking;
                                let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;
                                if (sinPago) {
                                    className = "payBockingRed";
                                } else if (pagoBocking || pagoTargeta) {
                                    className = "payBocking";
                                } else {
                                    className = "payNothing"; // Amarillo para los que no cumplen ninguna condición
                                }
                            } else {
                                // Las filas de coincidenciasPayCar y pagoBockingNoEncontrados siempre en amarillo
                                className = 'payBockingRed';
                            }

                        return (
                            <tr className={className} key={index}>
                                <td className="border px-4 py-2">{dato.reserva}</td>
                                <td className="border px-4 py-2">{dato.bocking}</td>
                                <td className="border px-4 py-2">{dato.pagoReserva}</td>
                                <td className="border px-4 py-2">{dato.pagoBocking}</td>
                                <td className="border px-4 py-2">{dato.pagoTarjeta}</td>
                                <td 
                                    style={{backgroundColor: `${pagoExtraEstilo}`}} 
                                    className="border px-4 py-2">{!dato.pagoReserva ? "Probablemente pago en efectivo" : dato.descripcion}
                                </td>
                                <td style={{backgroundColor: `${pagoExtraEstilo}`}} className="border px-4 py-2">
                                    <div className="form-check form-switch">
                                        <input 
                                            className="form-check-input" 
                                            type="checkbox" 
                                            role="switch" 
                                            id={`flexSwitchCheckChecked-${index}`} 
                                            checked={checkedState[index]}
                                            onChange={() => handleCheckboxChange(index)} />
                                        <label className="form-check-label" htmlFor="flexSwitchCheckChecked">Revisado</label>
                                    </div>
                                </td>
                                <td className="border px-4 py-2">
                                    Contenido
                                </td>
                                <td className="border px-4 py-2">
                                    <Button onClick={handleShowModal} size="small">Agregar</Button>
                                    <Button size="small">Editar</Button>
                                </td>
                            </tr>
                        );
                    })
                    
                    }
                    </tbody>
                </table>
            </div>
        </div>
        }
        <Modal show={showModal} onHide={handleCloseModal} />
        </>
    )
}

export default Table
