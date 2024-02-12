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

            const mapPayCar = new Map(payCar.map(item => {

                item[6] = item[6].replace("EUR", "").replace("+", "").replace(",00", "").replace(',', '.');

                return [item[6], item]
            
            }));

            reservas.forEach((reserva: any) => {
                if (reserva[0] === "Numero de reserva") return;

                let cadena = reserva[12] as string;
                let numeroBocking = reserva[3] as string;

                const servicios: ParteDescr[] = [
                    extraerServicio(cadena, "Parking", "Parking"),
                    extraerServicio(cadena, "snacks", "Snacks"),
                    extraerServicio(cadena, "JACUZZI", "Jacuzzi"),
                ];

                servicios.forEach(servicio => {
                    servicio.pago = servicio.numero ? mapPayCar.get(Number(servicio.numero)) : null;
                });

                let descr = construirDescripcion(...servicios);

                const pagoBock = pagoBocking.find(boki => numeroBocking === boki[1]);
                console.log(pagoBock);
                let pagoCard;
                if (reserva[14]) {
                    pagoCard = mapPayCar.get(String(reserva[14]));
                }
                if (!pagoCard && reserva[16]) {
                    pagoCard = mapPayCar.get(String(reserva[16]));
                }
                let valorReserv = "Sin informacion";
                if (reserva[17]) {
                    valorReserv = reserva[17] as string
                }else if(reserva[16]){
                    valorReserv = reserva[16] as string
                }else if(reserva[14]){
                    valorReserv = reserva[14] as string
                }
                if (cadena) {
                    coincidencias.push({
                        reserva: reserva[0] as string,
                        bocking: numeroBocking || "Sin booking",
                        pagoReserva: String(valorReserv),
                        pagoBocking: pagoBock ? (String(pagoBock[9]) === "" ? "Sin pago de bocking" : String(pagoBock[9])): "Sin pago de bocking",
                        pagoTarjeta: pagoCard ? pagoCard[6] as string : "Sin pago de tarjeta",
                        descripcion: descr
                    });
                }
            })

            payCar.forEach(card => {
                let clave = card[6] as string;
                const quitarEur = (clave.replace("EUR", "").replace("+", "").replace(",00", "").replace(',', '.'))

                if(!quitarEur || quitarEur.includes("Importe") || quitarEur.includes("importe")) return
                const coincidenciaReserva = reservas.find(reser => (String(reser[14]) === quitarEur || String(reser[16]) === quitarEur));
                if (!coincidenciaReserva) {
                    coincidenciasPayCar.push({
                        reserva: "Esta en pagos con tarjeta pero no en reservas",
                        bocking: "Esta en pagos con tarjeta pero no en reservas",
                        pagoReserva: "Esta en pagos con tarjeta pero no en reservas",
                        pagoBocking: "Esta en pagos con tarjeta pero no en reservas",
                        pagoTarjeta: quitarEur
                    });
                }
            });

            pagoBocking.forEach(boki => {
                const coincidenciaReserva = reservas.find(reserva => reserva[3] === boki[0]);
                if (!coincidenciaReserva && boki[1] !== "Número de referencia") {
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
            console.log(error);
            return rejectWithValue('Error en la contraseña');
        }
    }
);