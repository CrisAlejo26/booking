import { TablaCompleta } from "@/interfaces";
import { join } from 'path';
import { NextResponse } from "next/server";
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { v4 as uuidv4 } from 'uuid';

async function openDb() {
    return open({
        filename: join(process.cwd(), 'registrosRevisados.db'),
        driver: sqlite3.Database,
    });
}


export async function GET(request: Request) {

    return NextResponse.json({
        message: 'Hello, Next.js!'
    })

}

export async function POST(request: Request) {

    try {
        const body: TablaCompleta[] = await request.json()
        const db = await openDb();

        for (const registro of body) {
            const ui = uuidv4()
            try {
                const result = await db.run(
                    `INSERT INTO registros (uuId, origen, color, id, idTable, observaciones, reserva, bocking, pagoReserva, pagoBocking, pagoTarjeta, descripcion, checket, backgroundColor) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [uuidv4(), registro.origen, registro.color, registro.id, registro.idTable, registro.observaciones, registro.reserva, registro.bocking, registro.pagoReserva, registro.pagoBocking, registro.pagoTarjeta, registro.descripcion, registro.checket ? 1 : 0, registro.backgroundColor]
                );
            } catch (error) {
                console.error("Error al insertar registro:", error);
            }
        }

        return new NextResponse(JSON.stringify({ message: "Ingresado correctamente los datos" }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    } catch (error) {
        return NextResponse.json({
            message: error
        })
    }

}