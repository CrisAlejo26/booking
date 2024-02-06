import React from 'react'

function Probando() {

    // ! Snacks hecho

    let cadena = "Pagado en Booking - OKBK (46,12), Tarjeta - Captura de Token (0,00), Tarjeta - snacks (12,00)";
    cadena = "Tarjeta - snacks (12,00), Pagado en Booking - OKBK (46,12), Tarjeta - Captura de Token (0,00)";
    const palabras = cadena.split(', ')
    const busq = palabras.findIndex(palabra => palabra.includes('snacks'))
    const elementoSnacks = palabras[busq];

    // Usar una expresión regular para extraer el número
    let regex = /\(([^)]+)\)/;
    let matches = elementoSnacks.match(regex);

    let numero = "";
    if (matches && matches[1]) {
        numero = matches[1];
    }

    // console.log(numero);

    // ! Jacuzzi hecho

    let jacuzzi = "Pagado en Booking - ok booking (33,14), Tarjeta - Captura de Token (0,00), Datafono - JACUZZI (24,00)"
    jacuzzi = "Datafono - JACUZZI (24,00), Pagado en Booking - ok booking (33,14), Tarjeta - Captura de Token (0,00)"
    const jazuPala = jacuzzi.split(', ')
    const busqJacu = jazuPala.findIndex(palabra => palabra.includes('JACUZZI') || palabra.includes("Jacuzzi"))
    const elementoJacuzzi = jazuPala[busqJacu];
    // console.log(elementoJacuzzi);

    matches = elementoJacuzzi.match(regex);

    numero = "";
    if (matches && matches[1]) {
        numero = matches[1];
    }

    // console.log(numero);

    // ! Desayuno vendido hotel

    let desaHotel = "Tarjeta - CAPSULA (28,49), Datafono - desayuno vendido hotel  (8,00)"
    desaHotel = "Pagado en Booking - OKBK (84,56), Datafono - desayuno (16,00)"
    const desaPala = desaHotel.split(', ')
    const busqDesa = desaPala.findIndex(palabra => palabra.includes("desayuno"))
    const elementoDesaHotel = desaPala[busqDesa];

    matches = elementoDesaHotel.match(regex);

    numero = "";
    if (matches && matches[1]) {
        numero = matches[1];
    }

    // console.log(numero);

    // ! Chanclas

    let chanclas = "Datafono - Pago reserva (135,85), Tarjeta - Captura de Token (0,00), Tarjeta - Pago Chanclas (5,00)";
    const chanPala = chanclas.split(', ');
    const busqChan = chanPala.findIndex(palabra => palabra.includes("Chanclas"))
    const elementoChanclas = chanPala[busqChan];
    console.log(elementoChanclas);
    matches = elementoChanclas.match(regex);

    numero = "";
    if (matches && matches[1]) {
        numero = matches[1];
    }

    console.log(numero);

    return (
        <div>
        hola mundo
        </div>
    )
}

export default Probando
