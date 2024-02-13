import { useEffect, useMemo } from 'react';
import {
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import Button from '@mui/material/Button'; // Importar si no está ya importado
import Checkbox from '@mui/material/Checkbox'; // Importar si no está ya importado
import { useTable } from '@/hooks/useTable';
import { useAppSelector } from '@/store/store';
import getFilasFiltradas from '@/hooks/useFiltro';
import { Tabla } from '@/interfaces';

let datos: Tabla[] = []

const Example = () => {

    const { datoIdentificador, handleCloseModal, handleColorChange, loading, onClick, showModal, checkedState, handleCheckboxChange, todosDatos, editarObservacionModal  } = useTable()
    const filasFiltradas = useAppSelector(getFilasFiltradas);
    let efectivo = "";

    useEffect(() => {
        // Actualiza la variable global cuando filasFiltradas cambie
        datos = filasFiltradas;
    }, [filasFiltradas]);

    const columns = useMemo<MRT_ColumnDef<Tabla>[]>(
        () => [
        {
            accessorKey: 'reserva',
            header: 'N° de Reserva',
            size: 100,
        },
        {
            accessorKey: 'bocking',
            header: 'N° de boocking',
            size: 150,
        },
        {
            accessorKey: 'pagoReserva',
            header: 'Pago reserva',
            size: 150,
        },
        {
            accessorKey: 'pagoBocking',
            header: 'Pago Bocking',
            size: 150,
        },
        {
            accessorKey: 'pagoTarjeta',
            header: 'Pago Tarjeta',
            size: 150,
        },
        {
            accessorKey: 'descripcion',
            header: 'Pagos en TC',
            size: 150,
        },
        {
            accessorKey: 'pagoTarjeta',
            header: 'Observaciones',
            size: 200,
        },
        {
            accessorKey: 'checket',
            header: 'Estado',
            Cell: ({ cell, row }) => (
                <Checkbox
                    // checked={cell.}
                    onChange={(e) => handleCheckboxChange(row.original)}
                />
            ),
        },
        {
            header: 'Acciones',
            Cell: ({cell, row }) => (
                <div>
                    <Button onClick={() => console.log('Editar:', row.original)}>Editar</Button>
                    <Button onClick={() => console.log('Eliminar:', row.original)}>Eliminar</Button>
                </div>
            ),
        },
        ],
        [handleCheckboxChange],
    );

    const table = useMaterialReactTable({
            columns,
            data: datos,
            muiTableHeadCellProps: {
                //simple styling with the `sx` prop, works just like a style prop in this example
                sx: {
                    fontWeight: 'normal',
                    fontSize: '14px',
                    backgroundColor: '#E0F7FA',
                    },
                },
            muiTableBodyRowProps: (row) => ({
                sx: {
                    // Aplica un estilo personalizado basado en alguna lógica específica
                    // Ejemplo: Cambiar el color según el estado o la ciudad
                    // backgroundColor: "red", // Función personalizada para obtener el color
                },
            }),
        });

    return <MaterialReactTable table={table} />;
};

export default Example;
