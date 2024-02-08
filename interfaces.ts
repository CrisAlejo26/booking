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
}

export interface ModalProps {
    show: boolean;
    onHide: () => void;
    datoEditarObervacion: Tabla[]
    identificador: Tabla;
}