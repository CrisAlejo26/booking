import { useAppDispatch, useAppSelector } from '@/store/store';
import { ExcelRow, thunkBockingState } from '@/thunks/thunkBockingState';
import { useRouter } from 'next/navigation';
import { ChangeEvent, useState } from 'react'
import { toast } from 'sonner';
import * as XLSX from "xlsx";

export const useHome = () => {

    const router = useRouter();
    const dispatch = useAppDispatch();
    const [reservas, setReservas] = useState<any[]>([]);
    const { filasFiltradas } = useAppSelector(state => state.bocking);
    const [pagoBocking, setPagoBocking] = useState<any[]>([]);
    const [payCar, setPayCar] = useState<any[]>([]);

    const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>, tipoArchivo: string) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e: any) => {
            const ab = e.target.result;
            const wb = XLSX.read(ab, { type: "array" });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data = XLSX.utils.sheet_to_json(ws, { defval: "" }) as ExcelRow[];
            const informacion = data.map((reserva) => Object.values(reserva));
            if (tipoArchivo === "reservas") {
                setReservas(informacion);
            } else if (tipoArchivo === "pagoBocking") {
                setPagoBocking(informacion);
            } else if (tipoArchivo === "payCar") {
                setPayCar(informacion);
            }
        };
        reader.readAsArrayBuffer(file);
    };

    const onClick = async () => {

        // Verificar si todos los archivos han sido cargados
        if (reservas.length === 0 || pagoBocking.length === 0 || payCar.length === 0) {
            let mensajeFaltante = 'Falta por subir los siguientes archivos: ';
            if (reservas.length === 0) mensajeFaltante += ' Reservas ';
            if (pagoBocking.length === 0) mensajeFaltante += ' Pago Bocking';
            if (payCar.length === 0) mensajeFaltante += ' Pago con tarjeta ';

            toast.error(mensajeFaltante);
            return;
        }

        try {
            await dispatch(
                thunkBockingState({
                    pagoBocking: pagoBocking,
                    reservas: reservas,
                    payCar: payCar,
                })
                );
                router.push("/dashboard");
        } catch (error) {
            console.log(error);
        }
    };

    return {
        handleFileUpload,
        onClick,
        reservas,
        pagoBocking,
        payCar
    }
}
