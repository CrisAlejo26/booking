import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

type ExcelRow = (string | number | boolean)[];

interface CompareColumnsProps {
    data1: ExcelRow[];
    data2: ExcelRow[];
}

const CompareColumns: React.FC<CompareColumnsProps> = ({ data1, data2 }) => {
    useEffect(() => {
        data1.forEach((row1, index1) => {
            const id1 = row1[3]; // ID de la columna 3 de data1
            const precio1 = row1[11];
            data2.forEach((row2, index2) => {
                const id2 = row2[0]; // ID de la columna 3 de data2
                const precio2 = row2[5]
                if (row2[0] === id1) {
                    // console.log(`Coincidencia encontrada: ID ${id1} con ID ${id2}`);
                    // console.log(`El pago del es: ${precio1} - ${precio2}`);
                    
                }else {
                    console.log(`No son iguales, ${row2[0]} - ${id1}`);
                }
            });
        });
    }, [data1, data2]);

    return (
        <div>
            <h1>Sin data</h1>
            {/* Aquí puedes mostrar los resultados de la comparación */}
        </div>
    );
};

const Reservas: React.FC = () => {
    const [data1, setData1] = useState<ExcelRow[]>([]);
    const [data2, setData2] = useState<ExcelRow[]>([]);

    // Función para cargar datos desde un archivo Excel
    const fetchData = async (filePath: string, setData: React.Dispatch<React.SetStateAction<ExcelRow[]>>) => {
        try {
            const response = await fetch(filePath);
            const ab = await response.arrayBuffer();
            const wb = XLSX.read(ab, { type: 'array' });
            const wsname = wb.SheetNames[0];
            const ws = wb.Sheets[wsname];
            const data: ExcelRow[] = XLSX.utils.sheet_to_json(ws, { header: 1 });
            setData(data);
        } catch (error) {
            console.error("Error al cargar el archivo:", error);
        }
    };

    useEffect(() => {
        fetchData('/Reservas.xlsx', setData1);
        fetchData('/LISTADO PAGOS BK.xlsx', setData2);
    }, []);

    return <CompareColumns data1={data1} data2={data2} />;
};

export default Reservas;
