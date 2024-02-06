import { extraerNumerosPorPalabrasClave } from "@/helpers/extraerNumerosPalabras";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as XLSX from 'xlsx';
type ExcelRow = (string | number | boolean)[];
export type Encontrada = {
    reserva: string;
    bocking: string;
    pagoReserva: string;
    pagoBocking: string;
    pagoTarjeta: string
    origen?: string,
    descripcion?: string
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
                let numeroExtraido = "";
                let numn = 0
                if (reserva[0] === "Numero de reserva") {
                }
                let cadena: string = reserva[12] as string;
                if(cadena) {
                    numeroExtraido = "Tiene un pago por concepto de "
                    if(cadena.includes("Parking")) {
                        const regex = /\((\d+,\d+)\)/g;
                        const matches = cadena.match(regex);
                        if (matches && matches.length > 0) {
                            numeroExtraido += "Parking que se encuentra en el listado de tarjetas: €";
                            numn = Number(matches[matches.length - 1].replace(/\(/g, '').replace(/\)/g, '').replace(",00", ""));
                            numeroExtraido += numn;
                        } else {
                            console.log("No se encontró ningún número en la cadena.");
                        }
                    }
                    if(cadena.includes("snacks")) {
                        const cadena = "Pagado en Booking - OKBK (46,12), Tarjeta - Captura de Token (0,00), Tarjeta - snacks (12,00)";
                        let palabras = cadena.split(', ');
                        palabras = cadena.split('- ');
                        let position = palabras.find(nom => nom.includes('snacks'));
                        if(position) {
                            console.log(position.replace(/\([^)]*\)/, ""));
                        }
                        for (const palabra of palabras) {
                            const partes = palabra.split(' - ');
                            if (partes.length === 2 && partes[1].includes('snacks')) {
                                // const tipo = partes[0];
                                // const precio = partes[1].match(/\(([^)]+)\)/)[1];
                                // console.log(`Tipo: ${tipo}, Precio: ${precio}`);
                            }
                        }
                        // const regex = /\((\d+,\d+)\)/;
                        // const matches = cadena.match(regex);
                        // console.log(matches);
                        // if (matches && matches.length > 0) {
                        //     const numeroExtraido = matches[1];
                        //     // console.log(numeroExtraido);
                        //     // numeroExtraido += "Snacks que se encuentra en el listado de tarjetas: €";
                        // } else {
                        //     console.log("No se encontró ningún número en la cadena.");
                        // }
                    }
                }

                const pagoBock = pagoBocking.find(boki => reserva[3] === boki[0]);
                const pagoCard = payCar.find(card => reserva[14] === card[6] || reserva[16] === card[6]);
                let pagoParking;
                if(numn) {
                    pagoParking = payCar.find(card => numn === card[6]);
                    // console.log(pagoParking);
                }
                if(pagoBock) {
                    coincidencias.push({
                        reserva:  reserva[0] as string,
                        bocking: reserva[3] as string,
                        pagoReserva: reserva[17] as string,
                        pagoBocking: pagoBock ? pagoBock[5] as string : "Sin pago de bocking",
                        pagoTarjeta: pagoCard ? pagoCard[6] as string : "Sin pago de tarjeta",
                        descripcion: pagoParking ? `${numeroExtraido}` : "0",
                    });
                }else {
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
            console.log(error)
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