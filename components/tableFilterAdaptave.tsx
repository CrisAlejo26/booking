import { useEffect, useMemo } from 'react';
import {
    MRT_FilterFn,
    MaterialReactTable,
    useMaterialReactTable,
    type MRT_ColumnDef,
} from 'material-react-table';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { useTable } from '@/hooks/useTable';
import { useAppSelector } from '@/store/store';
import getFilasFiltradas from '@/hooks/useFiltro';
import { Tabla } from '@/interfaces';
import { ClockLoader } from 'react-spinners';
import Modal from './modal';

const TableFilter = () => {
    const {
        datoIdentificador, handleCloseModal, handleColorChange, loading,
        onClick, showModal, checkedState, handleCheckboxChange,
        todosDatos, editarObservacionModal
    } = useTable();
    const filasFiltradas = useAppSelector(getFilasFiltradas);
    let efectivo = "";

    const columns = useMemo<MRT_ColumnDef<Tabla>[]>(
        () => [
            {
                accessorKey: 'backgroundColor',
                header: 'Color',
                size: 80,
            },
            {
                accessorKey: 'reserva',
                header: 'Reserva',
                size: 80,
            },
            {
                accessorKey: 'bocking',
                header: 'Boocking',
                size: 100,
            },
            {
                accessorKey: 'pagoReserva', //normal accessorKey
                header: 'Pago reserva',
                size: 100,
            },
            {
                accessorKey: 'pagoBocking',
                header: 'Pago Bocking',
                size: 100,
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
                Cell: ({ row }) => {
                    const pagoExtraEstilo = row.original.descripcion?.includes("el pago por") ? 'red' : "white";
                    let efectivo;
                    efectivo = "Probablemente pago en efectivo";
                    if (row.original.pagoReserva === "Sin informacion") {
                        efectivo = "Probablemente pago en efectivo"
                    } else {
                        if (row.original.bocking === "Sin pago de bocking" && row.original.pagoTarjeta === "Sin pago de tarjeta") {
                            efectivo = "Probablemente pago en efectivo"
                        } else {
                            efectivo = row.original.descripcion || "Sin gastos extra"
                        }
                    }
                    return <div>
                        {efectivo === "Probablemente pago en efectivo" ? efectivo : row.original.descripcion}
                    </div>;
                },
            },
            {
                accessorKey: 'checket',
                header: 'Revisado',
                size: 50,
                Cell: ({ row }) => (
                    <Checkbox
                        checked={row.original.checket || false}
                        onChange={(event) => {
                            event.preventDefault()
                            event.stopPropagation(); // Esto evita que el evento se propague
                            handleCheckboxChange(row.original, event);
                        }}
                    />
                ),
            },
            {
                accessorKey: 'observaciones',
                header: 'Observaciones',
                size: 150,
            },
            {
                id: 'actions',
                header: 'Acciones',
                size: 150,
                Cell: ({ row }) => (
                    row.original.observaciones === "Sin observacion" ? 
                    <Button onClick={() => onClick(row.original)} size="small">
                        Agregar
                    </Button>
                    :
                    <Button onClick={() => editarObservacionModal(row.original)} size="small">
                        Editar
                    </Button>
                ),
            },
        ],
        [handleCheckboxChange, onClick, editarObservacionModal],
    );

    const table = useMaterialReactTable({
        columns,
        data: filasFiltradas, // Asegúrate de que filasFiltradas sea la fuente de datos correcta
        // enableColumnFiltering: true,
        enableColumnFilters: true,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'normal',
                fontSize: '14px',
                backgroundColor: '#E0F7FA',
            },
        },
        muiTableBodyRowProps: ({row}) => {
            let backgroundColor = row.original.color

            return {
                sx: {
                    backgroundColor,
                    // Aquí puedes añadir más estilos si lo necesitas
                },
            };
        },
    });

    return (
        <>
            {loading ? <div className='flex justify-center align-center mt-14'><ClockLoader size={150} color="#3659d6" /></div> :
                <div className='container mt-5 shadow-md mb-6'>
                    <MaterialReactTable table={table} />
                </div>
            }
            <Modal 
                identificador={datoIdentificador} 
                datoEditarObervacion={filasFiltradas} 
                show={showModal}
                onHide={handleCloseModal} 
            />
        </>
    );
};

export default TableFilter;
