import { useAppSelector } from "@/store/store";
import React from "react";

const Card = () => {

    
    const { coincidencias, coincidenciasPayCar, pagoBockingNoEncontrados } = useAppSelector(state => state.bocking.pagos)
    return (
        <div className="container containerCard">
            <div className="flex justify-evenly flex-wrap">
                <div className="p-6 w-96 mt-4 h-48 bg-blue-500 flex justify-center align-items-center cardBoxShadow flex-col">
                    <h1 className="text-white fs-2 text-center">Pagos efectivos</h1>
                    <h2 className="text-white fs-1 text-center">{coincidencias.length}</h2>
                </div>
                <div className="p-6 w-96 mt-4 h-48 bg-blue-500 flex justify-center align-items-center cardBoxShadow flex-col">
                    <h1 className="text-white fs-2 text-center">Pagos TC no encontrados</h1>
                    <h2 className="text-white fs-1 text-center">{coincidenciasPayCar.length}</h2>
                </div>
                <div className="p-6 w-96 mt-4 h-48 bg-blue-500 flex justify-center align-items-center cardBoxShadow flex-col">
                    <h1 className="text-white fs-2 text-center">Pagos Bocking no encontrados</h1>
                    <h2 className="text-white fs-1 text-center">{pagoBockingNoEncontrados.length}</h2>
                </div>
            </div>
        </div>
    );
};

export default Card;
