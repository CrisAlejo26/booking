export function extraerNumerosPorPalabrasClave(texto: string, palabrasClave: string[]): Record<string, string | null> {
    let resultados: Record<string, string | null> = {};
  
    palabrasClave.forEach(palabra => {
      const regex = new RegExp(palabra + "\\s+\\((\\d+,\\d+)\\)");
      const coincidencia = texto.match(regex);
  
      if (coincidencia && coincidencia.length > 1) {
        resultados[palabra] = coincidencia[1];
      } else {
        resultados[palabra] = null;
      }
    });
  
    return resultados;
  }


export function inicializarMapaDeCoincidencias(reservas: any) {
  const mapa = new Map();
  reservas.forEach((reserva: any) => {
      const clave = reserva[14] || reserva[16];
      if (!mapa.has(clave)) {
          mapa.set(clave, 1);
      } else {
          mapa.set(clave, mapa.get(clave) + 1);
      }
  });
  return mapa;
}