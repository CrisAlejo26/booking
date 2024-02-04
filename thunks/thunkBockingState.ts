import { createAsyncThunk } from "@reduxjs/toolkit";
import * as XLSX from 'xlsx';
type ExcelRow = (string | number | boolean)[];
export type Encontrada = {
    reserva: string;
    bocking: string;
    pagoReserva: string;
    pagoBocking: string;
    pagoTarjeta: string
    origen?: string
};

export const thunkBockingState = createAsyncThunk(

    'bockingPay',

    async ({reser, boki, payCard}: {reser: string, boki: string, payCard: string}, { rejectWithValue }) => {

        try {

            const fetchData = async (filePath: string): Promise<ExcelRow[]> => {
                const response = await fetch(filePath);
                const ab = await response.arrayBuffer();
                const wb = XLSX.read(ab, { type: 'array' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                return XLSX.utils.sheet_to_json(ws, { header: 1 }) as ExcelRow[];
            };

            const [reservas, pagoBocking, payCar] = await Promise.all([
                fetchData(reser),
                fetchData(boki),
                fetchData(payCard)
            ]);

            let coincidencias: Encontrada[] = [];
            let coincidenciasPayCar: Encontrada[] = [];
            let pagoBockingNoEncontrados: Encontrada[] = [];

            // Ejemplo de optimización: asumiendo que reservas es el array principal
            reservas.forEach(reserva => {
                if (reserva[0] === "Numero de reserva") {
                    return; // Continúa con el siguiente elemento del bucle
                }
                const pagoBock = pagoBocking.find(boki => reserva[3] === boki[0]);
                const pagoCard = payCar.find(card => reserva[14] === card[6] || reserva[16] === card[6]);
                if(pagoBock) {
                    coincidencias.push({
                        reserva:  reserva[0] as string,
                        bocking: reserva[3] as string,
                        pagoReserva: reserva[17] as string,
                        pagoBocking: pagoBock ? pagoBock[5] as string : "Sin pago de bocking",
                        pagoTarjeta: pagoCard ? pagoCard[6] as string : "Sin pago de tarjeta"
                    });
                }else if(pagoCard) {
                    coincidencias.push({
                        reserva:  reserva[0] as string,
                        bocking: reserva[3] as string,
                        pagoReserva: reserva[14] as string || reserva[16] as string,
                        pagoBocking: pagoBock ? pagoBock[5] as string : "Sin pago de bocking",
                        pagoTarjeta: pagoCard ? pagoCard[6] as string : "Sin pago de tarjeta"
                    });
                }
            });

            payCar.forEach(card => {
                const coincidenciaReserva = reservas.find(reserva => reserva[14] === card[6]);
                const coincidenciasDatafono = reservas.find(reserva => reserva[16] === card[6]);

                if (coincidenciaReserva || coincidenciasDatafono) {
                    return
                } else {
                    // Si no hay coincidencias, ejecutar este bloque
                    coincidenciasPayCar.push({
                        reserva: "Esta en pagos con tarjeta pero no en reservas",
                        bocking: "Esta en pagos con tarjeta pero no en reservas",
                        pagoReserva: "Esta en pagos con tarjeta pero no en reservas",
                        pagoBocking: "Esta en pagos con tarjeta pero no en reservas",
                        pagoTarjeta: card[6] as string
                    })
                }
            });

            pagoBocking.forEach(boki => {
                const coincidenciaReserva = reservas.find(reserva => reserva[3] === boki[0]);
                if (!coincidenciaReserva) {
                    pagoBockingNoEncontrados.push({
                        reserva: "Esta en pagos con bocking pero no en reservas",
                        bocking: boki[0] === "NÚMERO DE RESERVA" ? "Sin pago de bocking" : boki[0] as string,
                        pagoReserva: "Esta en pagos con bocking pero no en reservas",
                        pagoBocking: boki[0] === "NÚMERO DE RESERVA" ? "Sin pago de bocking" : boki[5] as string, // Asumiendo que este es el dato relevante
                        pagoTarjeta: "Esta en pagos con bocking pero no en reservas"
                    });
                }
            });

            return {coincidencias, coincidenciasPayCar, pagoBockingNoEncontrados};

        } catch (error: any) {
            const { response } = error
            if (response.data.message === 'Credenciales no validas (contraseña)') {
                return rejectWithValue('Error en la contraseña');
            }
            if (response.data.message === 'Credenciales no validas, tu usuario no se encuentra activo') {
                return rejectWithValue('Credenciales no validas, tu usuario no se encuentra activo');
            }
            else {
                return rejectWithValue('El usuario no existe');
            }
        }
    }
)