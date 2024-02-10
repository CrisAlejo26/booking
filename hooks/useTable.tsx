import { Pagos, Tabla } from '@/interfaces';
import { actualizarCheck, actualizarObservaciones, cambioFiltro, editarObservaciones } from '@/store/state/bockingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import React, { useEffect, useState } from 'react'

export const useTable = () => {

    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const { filasFiltradas, todosDatos } = useAppSelector(state => state.bocking);
    const [loading, setLoading] = useState(true)
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [datoIdentificador, setDatoIdentificador] = useState<Tabla>({origen: "",
        color: "",
        id: "",
        observaciones: "",
        reserva: "",
        bocking: "",
        pagoReserva: "",
        pagoBocking: "",
        pagoTarjeta: "",
        descripcion: ""});    

    const handleColorChange = (e: any) => {
        dispatch(cambioFiltro(e.target.value))
    }

    const [checkedState, setCheckedState] = useState(
        filasFiltradas.map((rot) =>  {
            return rot.checket
        })
    );

    // useEffect(() => {
    //     setCheckedState(filasFiltradas.map((rot) =>  {
    //         return rot.checket
    //     }))
    // }, [filasFiltradas])
    

    useEffect(() => {
        if(filasFiltradas.length === 0) {
            return setLoading(true)
        }
        console.log("renderizado");
        setLoading(false)
    }, [filasFiltradas])

    const handleCheckboxChange = (position: number) => {
        // Actualiza directamente el elemento afectado en el estado de los checkboxes
        const updatedCheckedState = [...checkedState];
        updatedCheckedState[position] = !updatedCheckedState[position];
        
        // Actualiza el estado local
        setCheckedState(updatedCheckedState);
        
        console.log(updatedCheckedState[position]);
        // Crea una copia de todosDatos y actualiza solo el elemento afectado
        // const updatedTodosDatos: Tabla[] = todosDatos.map((item, index) => {
        //     if (index === position) {
        //         console.log(item);
        //         return { ...item, checket: updatedCheckedState[position] };
        //     }
        //     return item;
        // });
    
        // Envía el arreglo actualizado a Redux
        dispatch(actualizarCheck(position));
    };

    const onClick = (dato: any) => {
        setShowModal(true)
        setDatoIdentificador(dato)
    }

    const editarObservacionModal = (dato: Tabla) => {
        dispatch(editarObservaciones(dato));
        setShowModal(true)
    }

    return {
        showModal,
        handleShowModal,
        handleCloseModal,
        datoIdentificador,
        onClick,
        loading,
        handleColorChange,
        filasFiltradas,
        handleCheckboxChange,
        checkedState,
        todosDatos,
        editarObservacionModal
    }
}
