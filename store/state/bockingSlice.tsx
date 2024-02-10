import { Tabla } from '@/interfaces';
import { Encontrada, thunkBockingState } from '@/thunks/thunkBockingState';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
// soporte4@neofranquicias.com	soport4%@

interface State {
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

const initialState: State = {
    pagos: {
        coincidencias: 0,
        coincidenciasPayCar: 0,
        pagoBockingNoEncontrados: 0
    },
    pagosAcumulados: {
        coincidencias: [],
        coincidenciasPayCar: [],
        pagoBockingNoEncontrados: []
    },

    messageBocking: "",
    colorFiltro: "",
    filasFiltradas: [],
    todosDatos: [],
    cambioObvervacion: false,
    editarObservaciones: {
        origen: "",
        color: "",
        id: "",
        observaciones: "",
        reserva: "",
        bocking: "",
        pagoReserva: "",
        pagoBocking: "",
        pagoTarjeta: "",
        descripcion: "",
    },
}

const bockingSlice = createSlice({
    name: "bocking",
    initialState,
    reducers: {
        cambioFiltro( state, action: PayloadAction<string>) {
            state.colorFiltro = action.payload
            const recargandoDatos = state.todosDatos.map((item, index) => 
            ({ 
                ...item, 
                origen: item.origen, 
                color: "payBocking", 
                id: item.id, 
                observaciones: item.observaciones === "Sin observacion" ? 
                "Sin observacion" :
                item.observaciones,
                checket: item.checket
            }))
            const filasFiltradas = [
                ...recargandoDatos
            ].filter(dato => {
                let sinPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta";
                let pagoBocking = dato.pagoReserva === dato.pagoBocking;
                let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;
                let pagoTarjetaSinImporteReservas = dato.reserva === "Esta en pagos con tarjeta pero no en reservas";
                let pagoBockingSinEncontrarEnReservas = dato.reserva === "Esta en pagos con bocking pero no en reservas"
                if (state.colorFiltro === "payBockingRed" && sinPago) return true;
                if (state.colorFiltro === "payBockingRed" && pagoBockingSinEncontrarEnReservas) return true
                if (state.colorFiltro === "payBockingRed" && pagoTarjetaSinImporteReservas) return true;
                if (state.colorFiltro === "payBocking" && (pagoBocking || pagoTargeta)) return true;
                if (state.colorFiltro === "payNothing" && !sinPago && !pagoBocking && !pagoTargeta) return true;
                if (state.colorFiltro === '') return true; // Muestra todos si no hay filtro

                return false;
            })

            state.filasFiltradas = filasFiltradas;
        },

        actualizarObservaciones( state, action: PayloadAction<{indice: number, data: Tabla[], observacion: string}>) {
            const { indice, data, observacion } = action.payload;
            state.todosDatos = action.payload.data;
            state.filasFiltradas = state.filasFiltradas.map((item, index) => 
                index === indice ? { ...item, observaciones: observacion } : item
            );
            state.filasFiltradas = [...state.filasFiltradas]
        },

        resetObservaciones( state) {
            state.editarObservaciones = {
                origen: "",
                color: "",
                id: "",
                observaciones: "",
                reserva: "",
                bocking: "",
                pagoReserva: "",
                pagoBocking: "",
                pagoTarjeta: "",
                descripcion: "",
            };
        },

        actualizarCheck( state, action: PayloadAction<number>) {
            const updatedCheckedState = [...state.todosDatos];
            updatedCheckedState[action.payload].checket = !updatedCheckedState[action.payload];
            state.todosDatos = updatedCheckedState;
        },

        editarObservaciones( state, action: PayloadAction<Tabla>) {
            state.editarObservaciones = action.payload
        },
    },

    extraReducers: (builder) => {
        builder
            .addCase(thunkBockingState.fulfilled, (state, action) => {
                if(action.payload) {
                    state.pagosAcumulados = action.payload
                    const coincidenciasConOrigen = action.payload.coincidencias.map((item, index) => {
                        
                        let sinPago = item.pagoBocking === "Sin pago de bocking" && item.pagoTarjeta === "Sin pago de tarjeta";
                        let sinPagoTarjeta = item.reserva === "Esta en pagos con tarjeta pero no en reservas"
                        let sinPagoBoking = item.reserva === "Esta en pagos con bocking pero no en reservas"
                        let pagoBocking = item.pagoReserva === item.pagoBocking;
                        let pagoTargeta = item.pagoReserva === item.pagoTarjeta;
                        if ( sinPago || sinPagoTarjeta || sinPagoBoking ) {
                            return({ 
                                ...item, 
                                origen: 'coincidencias', 
                                color: "payBocking", 
                                id: `coincidencias-${index}`, 
                                observaciones: "Sin observacion",
                                checket: true 
                            })
                        } else if (pagoBocking || pagoTargeta) {
                            return({ 
                                ...item, 
                                origen: 'coincidencias', 
                                color: "payBocking", 
                                id: `coincidencias-${index}`, 
                                observaciones: "Sin observacion",
                                checket: true 
                            })
                        } else {
                            return({ 
                                ...item, 
                                origen: 'SinCoincidencias', 
                                color: "payBocking", 
                                id: `coincidencias-${index}`, 
                                observaciones: "Sin observacion",
                                checket: false
                            })
                        }
                        
                    })
                    const coincidenciasPayCarConOrigen = action.payload.coincidenciasPayCar.map((item, index) => 
                        ({ 
                            ...item, 
                            origen: 'coincidenciasPayCar', 
                            color: "payBockingRed", 
                            id: `coincidenciasPayCar-${index}`, 
                            observaciones: "Sin observacion",
                            checket: false
                        }));
                    const pagoBockingNoEncontradosConOrigen = action.payload.pagoBockingNoEncontrados.map((item, index) => 
                        ({ 
                            ...item, 
                            origen: 'pagoBockingNoEncontrados', 
                            color: "payBockingRed", 
                            id: `pagoBockingNoEncontrados-${index}`, 
                            observaciones: "Sin observacion",
                            checket: false 
                        }));

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
                        if (state.colorFiltro === "payBockingRed" && sinPago) return true;
                        if (state.colorFiltro === "payBockingRed" && pagoBockingSinEncontrarEnReservas) return true
                        if (state.colorFiltro === "payBockingRed" && pagoTarjetaSinImporteReservas) return true;
                        if (state.colorFiltro === "payBocking" && (pagoBocking || pagoTargeta)) return true;
                        if (state.colorFiltro === "payNothing" && !sinPago && !pagoBocking && !pagoTargeta) return true;
                        if (state.colorFiltro === '') return true; // Muestra todos si no hay filtro

                        return false;
                    })

                    state.filasFiltradas = filasFiltradas;
                    state.todosDatos = filasFiltradas;
                    state.pagos = {
                        coincidencias: coincidenciasConOrigen.length,
                        coincidenciasPayCar: coincidenciasPayCarConOrigen.length,
                        pagoBockingNoEncontrados: pagoBockingNoEncontradosConOrigen.length
                    }

                    state.pagosAcumulados = {
                        coincidencias: [],
                        coincidenciasPayCar: [],
                        pagoBockingNoEncontrados: []
                    }
                }
            })
            .addCase(thunkBockingState.rejected, (state, action) => {
                state.messageBocking = "No se cargo el archivo de las reservas"
            })
            
    }
});

export const { cambioFiltro, actualizarObservaciones, editarObservaciones, actualizarCheck, resetObservaciones } = bockingSlice.actions

export default bockingSlice.reducer