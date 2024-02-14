export interface State {
    pagos: {
        coincidencias: number,
        coincidenciasPayCar: number,
        pagoBockingNoEncontrados: number
    };
    pagosAcumulados: {
        coincidencias: Encontrada[],
        coincidenciasPayCar: Encontrada[],
        pagoBockingNoEncontrados: Encontrada[]
    }
    messageBocking: string
    colorFiltro: string,
    filasFiltradas: Tabla[],
    todosDatos: Tabla[],
    cambioObvervacion: boolean,
    editarObservaciones: Tabla,
}

export type Encontrada = {
    reserva: string;
    bocking: string;
    pagoReserva: string;
    pagoBocking: string;
    pagoTarjeta: string;
    origen?: string,
    descripcion?: string
};


export interface Excels {
    reservas: [] | any[];
    pagoBocking: [] | any[];
    payCar: [] | any[];
}

export interface Tabla {
    uuId: string
    origen: string;
    color: string;
    id: string;
    idTable: string;
    observaciones: string;
    reserva: string;
    bocking: string;
    pagoReserva: string;
    pagoBocking: string;
    pagoTarjeta: string;
    descripcion?: string | undefined;
    checket?: boolean
    backgroundColor?: string
}

export interface TablaCompleta {
    uuId: string
    origen: string;
    color: string;
    id: string;
    idTable: string;
    observaciones: string;
    reserva: string;
    bocking: string;
    pagoReserva: string;
    pagoBocking: string;
    pagoTarjeta: string;
    descripcion: string;
    checket: boolean
    backgroundColor: string
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

export interface ServicioExtraido {
    servicio: string;
    numero: string;  // Cambiado de numeroServicio a numero para coincidir con ParteDescr
    pago: any;       // Añadido para coincidir con ParteDescr
}

export interface ParteDescr {
    servicio: string;
    numero: string;
    pago: any; // Asegúrate de que este tipo coincida con lo que usas en tu aplicación
}
