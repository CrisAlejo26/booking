import { Tabla } from '@/interfaces';
import { actualizarCheck, cambiarColorFiltro, editarObservaciones } from '@/store/state/bockingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { useEffect, useState } from 'react'

export const useTable = () => {

    const [showModal, setShowModal] = useState(false);
    const dispatch = useAppDispatch();
    const { filasFiltradas, todosDatos } = useAppSelector(state => state.bocking);
    const [loading, setLoading] = useState(true)
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [datoIdentificador, setDatoIdentificador] = useState<any>()

    const handleColorChange = (e: any) => {
        dispatch(cambiarColorFiltro(e.target.value))
    }

    const [checkedState, setCheckedState] = useState(
        filasFiltradas.map((rot) =>  {
            return rot.checket
        })
    );
    

    useEffect(() => {
        if(filasFiltradas.length === 0) {
            return setLoading(true)
        }
        setLoading(false)
    }, [])

    const handleCheckboxChange = (dato: Tabla, event: any) => {
        event.preventDefault()
        dispatch(actualizarCheck({ id: dato.id, checked: !dato.checket }));
    };

    const onClick = (dato: any) => {
        setShowModal(true)
        try {
            setDatoIdentificador(dato)
            console.log(dato);
        } catch (error) {
            console.log(error);
        }
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
