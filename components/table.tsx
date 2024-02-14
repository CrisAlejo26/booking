"use client"
import React from 'react'
import { ClockLoader } from 'react-spinners'
import Button from '@mui/material/Button';
import Modal from './modal';
import { useTable } from '@/hooks/useTable';
import { useAppSelector } from '@/store/store';
import getFilasFiltradas from '@/hooks/useFiltro';

const Table = () => {

    const { datoIdentificador, handleCloseModal, handleColorChange, loading, onClick, showModal, checkedState, handleCheckboxChange, todosDatos, editarObservacionModal  } = useTable()
    // const filasFiltradas = useAppSelector(getFilasFiltradas);
    let efectivo = "";

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
                        {filasFiltradas.map((dato, index) => {
                            let className;
                            let pagoExtraEstilo = dato.descripcion?.includes("el pago por") ? 'red' : null
                            if (dato.origen === 'coincidencias') {
                                let sinPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta";
                                let sinPagoTarjeta = dato.reserva === "Esta en pagos con tarjeta pero no en reservas"
                                let sinPagoBoking = dato.reserva === "Esta en pagos con bocking pero no en reservas"
                                let pagoBocking = dato.pagoReserva === dato.pagoBocking;
                                let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;
                                let SinPagosEfectivo = dato.bocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta"
                                efectivo = "Probablemente pago en efectivo";
                                if(dato.pagoReserva === "Sin informacion") {
                                    efectivo = "Probablemente pago en efectivo"
                                }else {
                                    if(SinPagosEfectivo){
                                        efectivo = "Probablemente pago en efectivo"
                                    }else {
                                        efectivo = dato.descripcion || "Sin gastos extra"
                                    }
                                }
                                if ( sinPago || sinPagoTarjeta || sinPagoBoking ) {
                                    className = "payBockingRed";
                                } else if (pagoBocking || pagoTargeta) {
                                    className = "payBocking";
                                } else {
                                    className = "payNothing";
                                }
                            } else if(dato.origen === 'SinCoincidencias') {
                                className = "payNothing";
                            }
                            else {
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
                                        className="border px-4 py-2">{efectivo === "Probablemente pago en efectivo" ? efectivo : dato.descripcion}
                                    </td>
                                    <td style={{backgroundColor: `${pagoExtraEstilo}`}} className="border px-4 py-2">
                                        <div className="form-check form-switch">
                                            <input 
                                                className="form-check-input" 
                                                type="checkbox" 
                                                role="switch" 
                                                id={`flexSwitchCheckChecked-${index}`} 
                                                checked={dato.checket || false}
                                                onChange={() => handleCheckboxChange(dato)}
                                            />
                                            <label 
                                                className="form-check-label" 
                                                htmlFor={`flexSwitchCheckChecked-${index}`}
                                            >
                                                Revisado
                                            </label>
                                        </div>
                                    </td>
                                    <td className="border px-4 py-2">
                                        {dato.observaciones}
                                    </td>
                                    <td className="border px-4 py-2">
                                        {
                                            dato.observaciones === "Sin observacion" && 
                                            <Button onClick={() => onClick(dato)} size="small">
                                                Agregar
                                            </Button>
                                        }
                                        {
                                            dato.observaciones !== "Sin observacion" && 
                                            <Button onClick={() => editarObservacionModal(dato)} size="small">
                                                Editar
                                            </Button>}
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
            <Modal 
                identificador={datoIdentificador} 
                datoEditarObervacion={todosDatos} 
                show={showModal} 
                onHide={handleCloseModal} 
            />
        </>
    )
}

export default Table
