import { RootState, useAppDispatch, useAppSelector } from '@/store/store';
import { createSelector } from 'reselect';

const getTodosDatos = (state: RootState) => state.bocking.todosDatos;
const getColorFiltro = (state: RootState) => state.bocking.colorFiltro;

// Selector memorizado para filtrar datos
// Selector memorizado para filtrar datos
const getFilasFiltradas = createSelector(
    [getTodosDatos, getColorFiltro],
    (todosDatos, colorFiltro) => {
        return todosDatos.filter(dato => {
            let sinPago = dato.pagoBocking === "Sin pago de bocking" && dato.pagoTarjeta === "Sin pago de tarjeta";
            let pagoBocking = dato.pagoReserva === dato.pagoBocking;
            let pagoTargeta = dato.pagoReserva === dato.pagoTarjeta;
            let pagoTarjetaSinImporteReservas = dato.reserva === "Esta en pagos con tarjeta pero no en reservas";
            let pagoBockingSinEncontrarEnReservas = dato.reserva === "Esta en pagos con bocking pero no en reservas";
            
            // Filtro para 'payBockingRed'
            if (colorFiltro === "payBockingRed") {
                return sinPago || pagoBockingSinEncontrarEnReservas || pagoTarjetaSinImporteReservas;
            }

            // Filtro para 'payBocking' (verde)
            if (colorFiltro === "payBocking") {
                return (pagoBocking || pagoTargeta) && !sinPago && !pagoBockingSinEncontrarEnReservas && !pagoTarjetaSinImporteReservas;
            }

            // Filtro para 'payNothing' (amarillo)
            if (colorFiltro === "payNothing") {
                return !sinPago && !pagoBocking && !pagoTargeta;
            }

            // Sin filtro
            if (colorFiltro === '') {
                return true; // Muestra todos si no hay filtro
            }

            return false;
        });
    }
);


export default getFilasFiltradas;
