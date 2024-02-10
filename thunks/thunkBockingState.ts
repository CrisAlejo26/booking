import { inicializarMapaDeCoincidencias } from "@/helpers/extraerNumerosPalabras";
import { createAsyncThunk } from "@reduxjs/toolkit";
import * as XLSX from 'xlsx';
export type ExcelRow = (string | number | boolean)[];
export type Encontrada = {
    reserva: string;
    bocking: string;
    pagoReserva: string;
    pagoBocking: string;
    pagoTarjeta: string;
    origen?: string,
    descripcion?: string
};

type ExcelData = string[][];


interface Excels {
    reservas: [] | any[];
    pagoBocking: [] | any[];
    payCar: [] | any[];
}

export const thunkBockingState = createAsyncThunk(

    'bockingPay',

    async ({reservas, pagoBocking, payCar}: Excels, { rejectWithValue }) => {

        try {

            const fetchData = async (filePath: string): Promise<ExcelRow[]> => {
                const response = await fetch(filePath);
                const ab = await response.arrayBuffer();
                const wb = XLSX.read(ab, { type: 'array' });
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                return XLSX.utils.sheet_to_json(ws, { header: 1 }) as ExcelRow[];
            };

            let coincidencias: Encontrada[] = [];
            let coincidenciasPayCar: Encontrada[] = [];
            let pagoBockingNoEncontrados: Encontrada[] = [];

            // Ejemplo de optimización: asumiendo que reservas es el array principal
            reservas.forEach(reserva => {
                let parking = "";
                let numnParking = ""
                let numnSnack = ""
                let numnjaccuzi = ""
                let numnDesayuno = ""
                let numnChanclas = ""
                let numnLavanderia = ""
                let numnRomantico = ""
                let numnNevera = ""
                let numnEstancia = ""
                let nevera = ""
                let estancia = ""
                let snack = ""
                let jaccuzi = ""
                let desayuno = ""
                let chanclas = ""
                let lavanderia = ""
                let romantico = ""
                let pagoEstancia
                let pagoNevera;
                let pagoParking;
                let pagoRomantico;
                let pagoSnacks;
                let pagoJacuzzi;
                let pagoDesayuno;
                let pagoChanclas;
                let pagoLavanderia;
                let descr = ""
                if (reserva[0] === "Numero de reserva") {
                    return
                }
                let cadena: string = reserva[12] as string;
                // console.log(cadena);
                let numeroBocking: string = reserva[3] as string;
                if(cadena) {
                    if(cadena.includes("Parking") || cadena.includes('parking') || cadena.includes('Ã‡Parking') || cadena.includes('PArking') || cadena.includes("paRKING") || cadena.includes("PARKING")) {
                        parking = "Parking € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes('Parking') || palabra.includes('parking') || palabra.includes('PArking') || palabra.includes('Ã‡Parking') || palabra.includes("paRKING") || palabra.includes("PARKING")) && !palabra.includes("Efectivo"))
                        const elementoParking = palabras[busq];
                        if(elementoParking) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoParking.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnParking = numero.replace(",00", "")
                                numnParking = numnParking.endsWith('0') ? numnParking.slice(0, -1) : numnParking;
                                numnParking = numnParking.replace(',', '.')
                                parking += numnParking
                            }
                        }
                    }
                    if(cadena.includes("snacks") || cadena.includes('Snacks') || cadena.includes('SNACKS') || cadena.includes("snack") || cadena.includes("sancks") || cadena.includes("sankcs")) {
                        snack = "Snacks € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes('snacks') || palabra.includes('Snacks') || palabra.includes('SNACKS') || palabra.includes("snack") || palabra.includes("sancks") || palabra.includes("sankcs")) && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnSnack = numero.replace(",00", "")
                                numnSnack = numnSnack.endsWith('0') ? numnSnack.slice(0, -1) : numnSnack;
                                numnSnack = numnSnack.replace(',', '.')
                                snack += numnSnack
                            }
                        }
                        
                    }
                    if(cadena.includes("JACUZZI") || cadena.includes("Jacuzzi") || cadena.includes("jacuzzi")) {
                        jaccuzi = "Jacuzzi € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes('Jacuzzi') || palabra.includes('JACUZZI') || palabra.includes("jacuzzi")) && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnjaccuzi = numero.replace(",00", "")
                                numnjaccuzi = numnjaccuzi.endsWith('0') ? numnjaccuzi.slice(0, -1) : numnjaccuzi;
                                numnjaccuzi = numnjaccuzi.replace(',', '.')
                                jaccuzi += numnjaccuzi
                            }
                        }
                    }

                    if(cadena.includes("desayuno") || cadena.includes("DESAYUNO") || cadena.includes('Desayuno') || cadena.includes("desayunos")) {
                        desayuno = "Desayuno € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes('desayuno') || palabra.includes('Desayuno') || palabra.includes("desayunos") || palabra.includes("DESAYUNO") || palabra.includes("DESAYUNO Y SNACK")) && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnDesayuno = numero.replace(",00", "")
                                numnDesayuno = numnDesayuno.endsWith('0') ? numnDesayuno.slice(0, -1) : numnDesayuno;
                                numnDesayuno = numnDesayuno.replace(',', '.')
                                desayuno += numnDesayuno
                            }
                        }
                    }

                    if(cadena.includes("Chanclas")) {
                        chanclas = "Chanclas € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => palabra.includes('Chanclas') && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                // numnChanclas = numnChanclas.endsWith('0') ? numnChanclas.slice(0, -1) : numnChanclas;
                                if (numero.endsWith(",00")) {
                                    numnChanclas = numnChanclas.replace(",00", "");
                                }
                                // Si tiene una coma seguida de exactamente un dígito y un '0', elimina el '0'
                                else if (/,(\d)0$/.test(numero)) {
                                    numnChanclas = numnChanclas.replace(/0$/, '');
                                }
                                numnChanclas = numnChanclas.replace(',', '.')
                                chanclas += numnChanclas
                            }
                        }
                    }
                    if(cadena.includes("LAVANDERIA") || cadena.includes("Lavanderia") || cadena.includes("lavanderia")) {
                        lavanderia = "Lavanderia € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes('LAVANDERIA') || palabra.includes("Lavanderia") || palabra.includes("lavanderia")) && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnLavanderia = numero.replace(",00", "");
                                numnLavanderia = numnLavanderia.replace(',', '.');
                                lavanderia += numnLavanderia
                            }
                        }
                    }
                    if(cadena.includes("romantico")) {
                        romantico = "Pack Romantico € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes("romantico")) && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnRomantico = numero.replace(",00", "");
                                numnRomantico = numnRomantico.replace(',', '.');
                                romantico += numnRomantico
                            }
                        }
                    }
                    if(cadena.includes("Nevera")) {
                        nevera = "Nevera € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes("Nevera")) && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnNevera = numero.replace(",00", "");
                                numnNevera = numnNevera.replace(',', '.');
                                nevera += numnNevera
                            }
                        }
                    }
                    if(cadena.includes("alarga estancia")) {
                        estancia = "Alarga estancia € "
                        let palabras = cadena.split(', ');
                        const busq = palabras.findIndex(palabra => (palabra.includes("alarga estancia")) && !palabra.includes("Efectivo"))
                        const elementoSnacks = palabras[busq];
                        if(elementoSnacks) {
                            let regex = /\(([^)]+)\)/;
                            let matches = elementoSnacks.match(regex);
                            let numero = "";
                            if (matches && matches[1]) {
                                numero = matches[1];
                                numnEstancia = numero.replace(",00", "");
                                numnEstancia = numnEstancia.replace(',', '.');
                                estancia += numnEstancia
                            }
                        }
                    }
                }

                // Busqueda en tarjetas y datafonos
                if(numnParking) {
                    pagoParking = payCar.find(card => Number(numnParking) === card[6]);
                }
                if(numnSnack) {
                    pagoSnacks = payCar.find(card => Number(numnSnack) === card[6]);
                }
                if(numnjaccuzi) {
                    pagoJacuzzi = payCar.find(card => Number(numnjaccuzi) === card[6]);
                }
                if(numnDesayuno) {
                    pagoDesayuno = payCar.find(card => Number(numnDesayuno) === card[6]);
                }
                if(numnChanclas) {
                    pagoChanclas = payCar.find(card => Number(numnChanclas) === card[6]);
                }
                if(numnLavanderia) {
                    pagoLavanderia = payCar.find(card => Number(numnLavanderia) === card[6]);
                }
                if(numnRomantico) {
                    pagoRomantico = payCar.find(card => Number(numnRomantico) === card[6]);
                }
                if(numnNevera) {
                    pagoNevera = payCar.find(card => Number(numnNevera) === card[6]);
                }
                if(numnEstancia) {
                    pagoEstancia = payCar.find(card => Number(numnEstancia) === card[6]);
                }

                // Mostrar resultado segun busquedas
                let partesDescr = [];

                if (pagoSnacks) {
                    partesDescr.push(snack);
                } else if (!pagoSnacks && numnSnack) {
                    partesDescr.push(`el pago por snack no encontrado ${numnSnack}`);
                }

                if (pagoJacuzzi) {
                    partesDescr.push(jaccuzi);
                } else if (!pagoJacuzzi && numnjaccuzi) {
                    partesDescr.push(`el pago por jacuzzi no encontrado ${numnjaccuzi}`);
                }

                if (pagoDesayuno) {
                    partesDescr.push(desayuno);
                } else if (!pagoDesayuno && numnDesayuno) {
                    partesDescr.push(`el pago por desayuno no encontrado ${numnDesayuno}`);
                }

                if (pagoChanclas) {
                    partesDescr.push(chanclas);
                } else if (!pagoChanclas && numnChanclas) {
                    partesDescr.push(`el pago por chanclas no encontrado ${numnChanclas}`);
                }
                if (pagoLavanderia) {
                    partesDescr.push(lavanderia);
                } else if (!pagoLavanderia && numnLavanderia) {
                    partesDescr.push(`el pago por lavanderia no encontrado ${numnLavanderia}`);
                }
                if (pagoRomantico) {
                    partesDescr.push(romantico);
                } else if (!pagoRomantico && numnRomantico) {
                    partesDescr.push(`el pago por lavanderia no encontrado ${numnRomantico}`);
                }
                if (pagoNevera) {
                    partesDescr.push(nevera);
                } else if (!pagoNevera && numnNevera) {
                    partesDescr.push(`el pago por lavanderia no encontrado ${numnNevera}`);
                }
                if (pagoEstancia) {
                    partesDescr.push(estancia);
                } else if (!pagoNevera && numnEstancia) {
                    partesDescr.push(`el pago por lavanderia no encontrado ${numnEstancia}`);
                }

                if (pagoParking) {
                    partesDescr.push(parking);
                } else if (!pagoParking && numnParking) {
                    partesDescr.push(`el pago por parking no encontrado ${numnParking}`);
                }

                descr = partesDescr.length > 0 ? partesDescr.join(', ') : "Sin pagos extras";

                // Manejo especial para cuando hay exactamente dos elementos
                if (partesDescr.length === 2) {
                    descr = partesDescr.join(' y ');
                }
                if (partesDescr.length === 0 && numnSnack) {
                    descr = `No se encontró el pago por ${snack}`;
                }

                // Si no se encontró ningún pago y numnSnack está presente
                descr = partesDescr.length > 0 ? partesDescr.join(', ') : "Sin pagos extras";
                if (partesDescr.length === 2) {
                    descr = partesDescr.join(' y ');
                }
                const pagoBock = pagoBocking.find(boki => reserva[3] === boki[0]);
                // let pagoCard = payCar.find(card => reserva[14] === card[6] || reserva[16] === card[6]);
                let pagoCard = payCar.find(card => reserva[14] === card[6] || reserva[16] === card[6]);
                // Seleccionando solo el bocking
                // Verificar si 'pagoCard' se encontró y su longitud
                if(numeroBocking && cadena) {
                    if(pagoBock) {
                        coincidencias.push({
                            reserva:  reserva[0] as string,
                            bocking: reserva[3] as string,
                            pagoReserva: reserva[17] as string,
                            pagoBocking: pagoBock ? pagoBock[5] as string : "Sin pago de bocking",
                            pagoTarjeta: pagoCard ? pagoCard[6] as string  : "Sin pago de tarjeta",
                            descripcion: descr,
                        })
                    }else {
                        if(pagoCard) {
                            coincidencias.push({
                                reserva:  reserva[0] as string,
                                bocking: reserva[3] as string,
                                pagoReserva: reserva[14] as string || reserva[16] as string,
                                pagoBocking: pagoBock ? pagoBock[5] as string : "Sin pago de bocking",
                                pagoTarjeta: pagoCard ? pagoCard[6] as string : "Sin pago de tarjeta",
                                descripcion: descr,
                            });
                        }
                    }
                }
            });

            const mapaDeCoincidencias = inicializarMapaDeCoincidencias(reservas)
            payCar.forEach(card => {
                const clave = card[6];
                const coincidenciaReserva = reservas.find(reserva => (reserva[14] === clave || reserva[16] === clave) && mapaDeCoincidencias.get(clave) > 0);
                if (coincidenciaReserva) {
                    mapaDeCoincidencias.set(clave, mapaDeCoincidencias.get(clave) - 1);
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
                if (!coincidenciaReserva && boki[0] !== "NÚMERO DE RESERVA") {
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