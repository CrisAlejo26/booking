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

let datos: Tabla[] = []

const TableFilter = () => {
    const {
        datoIdentificador, handleCloseModal, handleColorChange, loading,
        onClick, showModal, checkedState, handleCheckboxChange,
        todosDatos, editarObservacionModal
    } = useTable();
    const filasFiltradas = useAppSelector(getFilasFiltradas);
    let efectivo = "";

    // Función de filtrado personalizada para la columna de color
    const filterColor: MRT_FilterFn<Tabla> = ({ column, row, filterValue }) => {
        // Aquí defines cómo se compara el valor de la fila con el valor del filtro
        // Por ejemplo, si tuvieras una propiedad 'color' en tus datos:
        return row.original.color === filterValue;
    };

    useEffect(() => {
        datos = filasFiltradas;
    }, [filasFiltradas]);

    const columns = useMemo<MRT_ColumnDef<Tabla>[]>(
        () => [
            {
                accessorKey: 'color', // Asegúrate de que esta clave coincida con tus datos
                header: 'Color',
                filterFn: filterColor, // Usando la función de filtrado personalizada
                // Otros ajustes de la columna...
            },
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
                accessorKey: 'pagoReserva', //normal accessorKey
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
                        onChange={() => handleCheckboxChange(row.original)}
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
        enableColumnFiltering: true,
        muiTableHeadCellProps: {
            sx: {
                fontWeight: 'normal',
                fontSize: '14px',
                backgroundColor: '#E0F7FA',
            },
        },
        muiTableBodyRowProps: ({row}) => {
            let backgroundColor = '#FFF'; // Color por defecto
            if (row.original.origen === 'coincidencias') {
                let sinPago = row.original.pagoBocking === "Sin pago de bocking" && row.original.pagoTarjeta === "Sin pago de tarjeta";
                let sinPagoTarjeta = row.original.reserva === "Esta en pagos con tarjeta pero no en reservas";
                let sinPagoBoking = row.original.reserva === "Esta en pagos con bocking pero no en reservas";
                let pagoBocking = row.original.pagoReserva === row.original.pagoBocking;
                let pagoTargeta = row.original.pagoReserva === row.original.pagoTarjeta;
                let SinPagosEfectivo = row.original.bocking === "Sin pago de bocking" && row.original.pagoTarjeta === "Sin pago de tarjeta";
                
                if (sinPago || sinPagoTarjeta || sinPagoBoking) {
                    backgroundColor = 'red'; // Rojo para ciertas condiciones
                } else if (pagoBocking || pagoTargeta || SinPagosEfectivo) {
                    backgroundColor = '#DBE7C9'; // Verde para otras condiciones
                } 
            } else if (row.original.origen === 'SinCoincidencias') {
                backgroundColor = '#FFF59D'; // Amarillo para sin coincidencias
            }

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
                <div className='container mt-5 shadow-md mb-5'><MaterialReactTable table={table} /></div>
            }
            {/* Aquí iría tu componente Modal si es necesario */}
        </>
    );
};

export default TableFilter;
