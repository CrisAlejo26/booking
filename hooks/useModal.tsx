import { Tabla } from '@/interfaces';
import { actualizarObservaciones, resetObservaciones } from '@/store/state/bockingSlice';
import { useAppDispatch, useAppSelector } from '@/store/store';
import { CSSProperties, useEffect, useState } from 'react'
import { toast } from 'sonner'

interface Shows {
    show: any;
    onHide: any;
    datoEditarObervacion?: Tabla[];
    identificador: Tabla;
}

const useModal = ({show, onHide, datoEditarObervacion, identificador}: Shows) => {

    const dispatch = useAppDispatch()
    const { editarObservaciones, filasFiltradas } = useAppSelector(state => state.bocking);
    const [observacion, setObservacion] = useState('')
    const showHideClassName = show ? "modal fade show d-block" : "modal fade";
    const backdropStyle: CSSProperties = {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.5)',
        zIndex: 1040, // Bootstrap modal backdrop z-index
        display: show ? 'block' : 'none',
    };

    useEffect(() => {
        if(editarObservaciones) {
            setObservacion(editarObservaciones.observaciones)
        }
    }, [editarObservaciones])
    

    const onChangeInput = (event: any) => {
        setObservacion(event.target.value)
    }

    const onClickGuardar = () => {
        if(!observacion) {
            return toast.error("El campo de observacion esta vacio");
        }
        
        const indiceObjetoEncontrado = filasFiltradas.findIndex(it => it.id === identificador.id);

        if (indiceObjetoEncontrado !== -1) {
            // Crear una nueva lista con el objeto modificado
            const nuevaLista = [...filasFiltradas];
            nuevaLista[indiceObjetoEncontrado] = { ...nuevaLista[indiceObjetoEncontrado], observaciones: observacion };
            dispatch(actualizarObservaciones({data: nuevaLista, indice: indiceObjetoEncontrado, observacion: observacion}));
            setObservacion('')
            dispatch(resetObservaciones())
            onHide();
        }
    }
    

    const cerrarCampo = () => {
        setObservacion('')
        onHide();
        dispatch(resetObservaciones())
    }

    return {
        showHideClassName,
        backdropStyle,
        onChangeInput,
        cerrarCampo,
        onClickGuardar,
        observacion
    }
}

export default useModal