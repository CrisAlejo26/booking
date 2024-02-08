import { Tabla } from '@/interfaces';
import { Encontrada, thunkBockingState } from '@/thunks/thunkBockingState';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'
// soporte4@neofranquicias.com	soport4%@
let coincidencias: Encontrada[] = [];
let coincidenciasPayCar: Encontrada[] = [];
let pagoBockingNoEncontrados: Encontrada[] = [];

interface State {
    pagos: {
        coincidencias: Encontrada[],
        coincidenciasPayCar: Encontrada[],
        pagoBockingNoEncontrados: Encontrada[]
    };
    messageBocking: string
    colorFiltro: string,
    filasFiltradas: Tabla[]
}

const initialState: State = {
    pagos: {
        coincidencias: [],
        coincidenciasPayCar: [],
        pagoBockingNoEncontrados: []
    },
    messageBocking: "",
    colorFiltro: "",
    filasFiltradas: []
}

const bockingSlice = createSlice({
    name: "bocking",
    initialState,
    reducers: {
        cambioFiltro( state, action: PayloadAction<string>) {
            console.log(action.payload);
            state.colorFiltro = action.payload
        }


    },

    extraReducers: (builder) => {
        builder
            .addCase(thunkBockingState.fulfilled, (state, action) => {
                if(action.payload) {
                    state.pagos = action.payload
                    const coincidenciasConOrigen = action.payload.coincidencias.map((item, index) => 
                        ({ ...item, origen: 'coincidencias', color: "payBocking", id: `coincidencias-${index}`, observaciones: "Sin observacion" }));
                    const coincidenciasPayCarConOrigen = action.payload.coincidenciasPayCar.map((item, index) => 
                        ({ ...item, origen: 'coincidenciasPayCar', color: "payBockingRed", id: `coincidenciasPayCar-${index}`, observaciones: "Sin observacion" }));
                    const pagoBockingNoEncontradosConOrigen = action.payload.pagoBockingNoEncontrados.map((item, index) => 
                        ({ ...item, origen: 'pagoBockingNoEncontrados', color: "payBockingRed", id: `pagoBockingNoEncontrados-${index}`, observaciones: "Sin observacion" }));

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
                }
            })
            .addCase(thunkBockingState.rejected, (state, action) => {
                state.messageBocking = "No se cargo el archivo de las reservas"
            })
            
    }
});

export const { cambioFiltro } = bockingSlice.actions

export default bockingSlice.reducer