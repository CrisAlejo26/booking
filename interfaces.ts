import { Encontrada } from "./thunks/thunkBockingState";

export interface Tabla {
    origen: string;
    color: string;
    id: string;
    observaciones: string;
    reserva: string;
    bocking: string;
    pagoReserva: string;
    pagoBocking: string;
    pagoTarjeta: string;
    descripcion?: string | undefined;
    checket?: boolean
}

export interface ModalProps {
    show: boolean;
    onHide: () => void;
    datoEditarObervacion: Tabla[]
    identificador: Tabla;
}

export interface Pagos {
    coincidencias: Encontrada[],
    coincidenciasPayCar: Encontrada[],
    pagoBockingNoEncontrados: Encontrada[]
};