import { ParteDescr, ServicioExtraido } from "@/interfaces";

export function extraerServicio(cadena: string | undefined, tipoServicio: string, nombreServicio: string): ServicioExtraido {
    let servicio = "";
    let numero = "";

    if (cadena && cadena.includes(tipoServicio)) {
        servicio = `${nombreServicio} € `;
        let palabras = cadena.split(', ');
        const busq = palabras.findIndex(palabra => palabra.includes(tipoServicio) && !palabra.includes("Efectivo"));
        const elementoServicio = palabras[busq];
        if (elementoServicio) {
            let regex = /\(([^)]+)\)/;
            let matches = elementoServicio.match(regex);
            if (matches && matches[1]) {
                numero = matches[1].replace(",00", "").replace(',', '.');
                if (numero.endsWith('0')) {
                    numero = numero.slice(0, -1);
                }
                servicio += numero;
            }
        }
    }
    return { servicio, numero, pago: null };  // Inicializamos pago como null
}




export function construirDescripcion(...partes: ParteDescr[]): string {

    let descripciones = partes.filter(parte => parte.numero !== "").map(parte => `El pago por ${parte.servicio} se encontró`);
    if (descripciones.length === 0) return "Sin pagos extras";
    if (descripciones.length === 2) return descripciones.join(' y ');
    return descripciones.join(', ');
}

