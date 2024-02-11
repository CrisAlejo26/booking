import { construirDescripcion, extraerServicio } from "@/helpers/extraerServicio";
import { Encontrada, Excels, ParteDescr } from "@/interfaces";
import { createAsyncThunk } from "@reduxjs/toolkit";
export type ExcelRow = (string | number | boolean)[];

export const thunkBockingState = createAsyncThunk(
    'bockingPay',
    async ({ reservas, pagoBocking, payCar }: Excels, { rejectWithValue }) => {
        try {
            let coincidencias: Encontrada[] = [];
            let coincidenciasPayCar: Encontrada[] = [];
            let pagoBockingNoEncontrados: Encontrada[] = [];

            const mapPayCar = new Map(payCar.map(item => [item[6], item]));

            reservas.forEach((reserva: any) => {
                if (reserva[0] === "Numero de reserva") return;

                let cadena = reserva[12] as string;
                let numeroBocking = reserva[3] as string;

                const servicios: ParteDescr[] = [
                    extraerServicio(cadena, "Parking", "Parking"),
                    extraerServicio(cadena, "snacks", "Snacks"),
                    extraerServicio(cadena, "JACUZZI", "Jacuzzi"),
                    // ... otros servicios
                ];

                servicios.forEach(servicio => {
                    servicio.pago = servicio.numero ? mapPayCar.get(Number(servicio.numero)) : null;
                });
                

                let descr = construirDescripcion(...servicios);

                const pagoBock = pagoBocking.find(boki => numeroBocking === boki[0]);
                let pagoCard = mapPayCar.get(reserva[14]) || mapPayCar.get(reserva[16]);

                if (numeroBocking && cadena) {
                    coincidencias.push({
                        reserva: reserva[0] as string,
                        bocking: numeroBocking,
                        pagoReserva: reserva[17] as string,
                        pagoBocking: pagoBock ? pagoBock[5] as string : "Sin pago de bocking",
                        pagoTarjeta: pagoCard ? pagoCard[6] as string : "Sin pago de tarjeta",
                        descripcion: descr
                    });
                }
            });

            payCar.forEach(card => {
                const clave = card[6];
                const coincidenciaReserva = reservas.find(reserva => (reserva[14] === clave || reserva[16] === clave) && !coincidencias.some(coincidencia => coincidencia.pagoTarjeta === clave));
                if (!coincidenciaReserva) {
                    coincidenciasPayCar.push({
                        reserva: "Esta en pagos con tarjeta pero no en reservas",
                        bocking: "Esta en pagos con tarjeta pero no en reservas",
                        pagoReserva: "Esta en pagos con tarjeta pero no en reservas",
                        pagoBocking: "Esta en pagos con tarjeta pero no en reservas",
                        pagoTarjeta: card[6] as string
                    });
                }
            });

            pagoBocking.forEach(boki => {
                const coincidenciaReserva = reservas.find(reserva => reserva[3] === boki[0]);
                if (!coincidenciaReserva && boki[0] !== "NÚMERO DE RESERVA") {
                    pagoBockingNoEncontrados.push({
                        reserva: "Esta en pagos con bocking pero no en reservas",
                        bocking: boki[0] as string,
                        pagoReserva: "Esta en pagos con bocking pero no en reservas",
                        pagoBocking: boki[5] as string,
                        pagoTarjeta: "Esta en pagos con bocking pero no en reservas"
                    });
                }
            });

            return { coincidencias, coincidenciasPayCar, pagoBockingNoEncontrados };
        } catch (error: any) {
            // Manejo de errores
            const { response } = error;
            if (response?.data?.message === 'Credenciales no validas (contraseña)') {
                return rejectWithValue('Error en la contraseña');
            } else if (response?.data?.message === 'Credenciales no validas, tu usuario no se encuentra activo') {
                return rejectWithValue('Credenciales no validas, tu usuario no se encuentra activo');
            } else {
                return rejectWithValue('El usuario no existe');
            }
        }
    }
);