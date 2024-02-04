import { Encontrada, thunkBockingState } from '@/thunks/thunkBockingState';
import { PayloadAction, createSlice } from '@reduxjs/toolkit'

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
}

const initialState: State = {
    pagos: {
        coincidencias: [],
        coincidenciasPayCar: [],
        pagoBockingNoEncontrados: []
    },
    messageBocking: ""
}

const bockingSlice = createSlice({
    name: "bocking",
    initialState,
    reducers: {
        increment(state) {
        },
        decrement(state) {

        },
        resetState( state, action: PayloadAction<number>) {

        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(thunkBockingState.fulfilled, (state, action) => {
                if(action.payload) {
                    state.pagos = action.payload
                }
            })
            .addCase(thunkBockingState.rejected, (state, action) => {
                state.messageBocking = "No se cargo el archivo de las reservas"
            })
            
    }
});

export const {increment, decrement} = bockingSlice.actions

export default bockingSlice.reducer