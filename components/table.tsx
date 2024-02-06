import { useAppSelector } from '@/store/store'
import { Encontrada } from '@/thunks/thunkBockingState';
import React, { useEffect, useState } from 'react'
import { hourglass } from 'ldrs'
import Probando from './prueba';

interface Pagos {
    coincidencias: Encontrada[],
    coincidenciasPayCar: Encontrada[],
    pagoBockingNoEncontrados: Encontrada[]
};

const Table = () => {

    const { coincidencias, coincidenciasPayCar, pagoBockingNoEncontrados }: Pagos = useAppSelector(state => state.bocking.pagos);
    const [colorFiltro, setColorFiltro] = useState('');

    const [loading, setLoading] = useState(true)

    useEffect(() => {
        setLoading(false)
    }, [coincidencias])

    const handleColorChange = (e: any) => {
        setColorFiltro(e.target.value);
    };

    const coincidenciasConOrigen = coincidencias.map(item => ({ ...item, origen: 'coincidencias' }));
    const coincidenciasPayCarConOrigen = coincidenciasPayCar.map(item => ({ ...item, origen: 'coincidenciasPayCar' }));
    const pagoBockingNoEncontradosConOrigen = pagoBockingNoEncontrados.map(item => ({ ...item, origen: 'pagoBockingNoEncontrados' }));

    const filasFiltradas = [
        ...coincidenciasConOrigen,
        ...coincidenciasPayCarConOrigen,
        ...pagoBockingNoEncontradosConOrigen
    ].filter(dato => {
        let sinPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta";
        let pagoBocking = dato.pagoReserva === dato.pagoBocking;
        let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;

        if (colorFiltro === "payBockingRed" && sinPago) return true;
        if (colorFiltro === "payBocking" && (pagoBocking || pagoTargeta)) return true;
        if (colorFiltro === "payNothing" && !sinPago && !pagoBocking && !pagoTargeta) return true;
        if (colorFiltro === '') return true; // Muestra todos si no hay filtro

        return false;
    });
    
    hourglass.register()

    return (
        <>
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
                    </tr>
                    </thead>
                    <tbody>

                    {filasFiltradas.map((dato, index) => {
                        let className;
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
                            className = 'payNothing';
                        }

                        return (
                            <tr className={className} key={index}>
                                <td className="border px-4 py-2">{dato.reserva}</td>
                                <td className="border px-4 py-2">{dato.bocking}</td>
                                <td className="border px-4 py-2">{dato.pagoReserva}</td>
                                <td className="border px-4 py-2">{dato.pagoBocking}</td>
                                <td className="border px-4 py-2">{dato.pagoTarjeta}</td>
                            </tr>
                        );
                    })}
                    {/* {filasFiltradas.map((dato, index) => {
                        let realizoPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta";
                        let pagoBocking = dato.pagoReserva === dato.pagoBocking;
                        let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;
                        
                        // Determinar la clase en función de los datos
                        let className = realizoPago ? "payBockingRed" : 
                                        (pagoBocking || pagoTargeta) ? "payBocking" : 
                                        "payNothing"; // Modifica esto según tus necesidades

                        return (
                            <tr className={className} key={index}>
                                <td className="border px-4 py-2">{dato.reserva}</td>
                                <td className="border px-4 py-2">{dato.bocking}</td>
                                <td className="border px-4 py-2">{dato.pagoReserva}</td>
                                <td className="border px-4 py-2">{dato.pagoBocking}</td>
                                <td className="border px-4 py-2">{dato.pagoTarjeta}</td>
                            </tr>
                        );
                    })} */}
                        {/* {
                            coincidenciasPayCar.map((dato, index) => {
                                return (
                                <tr className="payNothing" key={index}
                                >
                                    <td className="border px-4 py-2">{dato.reserva}</td>
                                    <td className="border px-4 py-2">{dato.bocking}</td>
                                    <td className="border px-4 py-2">{dato.pagoReserva}</td>
                                    <td className="border px-4 py-2">{dato.pagoBocking}</td>
                                    <td className="border px-4 py-2">{dato.pagoTarjeta}</td>
                                </tr>
                                )
                            })
                        }
                        {
                            pagoBockingNoEncontrados.map((dato, index) => {
                                return (
                                    <tr className="payNothing" key={index}
                                >
                                    <td className="border px-4 py-2">{dato.reserva}</td>
                                    <td className="border px-4 py-2">{dato.bocking}</td>
                                    <td className="border px-4 py-2">{dato.pagoReserva}</td>
                                    <td className="border px-4 py-2">{dato.pagoBocking}</td>
                                    <td className="border px-4 py-2">{dato.pagoTarjeta}</td>
                                </tr>
                                )
                            })
                        }
                        {coincidencias.map((dato, index) => {
                            let pagoBocking = dato.pagoReserva === dato.pagoBocking;
                            let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;
                            let realizoPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta"
                            return (
                                <tr 
                                    className={
                                        realizoPago ? 
                                        "payBockingRed" : 
                                        (pagoBocking ? "payBocking" : (pagoTargeta ? "payBocking": ""))
                                    }
                                    key={index}
                                >
                                    <td className="border px-4 py-2">{dato.reserva}</td>
                                    <td className="border px-4 py-2">{dato.bocking}</td>
                                    <td className="border px-4 py-2">{dato.pagoReserva}</td>
                                    <td className="border px-4 py-2">{dato.pagoBocking}</td>
                                    <td className="border px-4 py-2">{dato.pagoTarjeta}</td>
                                </tr>
                            );
                        })} */}

                    <Probando/>
                    </tbody>
                </table>
            </div>
        </div>
        </>
    )
}

export default Table
