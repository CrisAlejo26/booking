import useModal from '@/hooks/useModal';
import { ModalProps } from '@/interfaces';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from 'react'
import { toast } from 'sonner'

const Modal: React.FC<ModalProps> = ({ show, onHide, datoEditarObervacion, identificador }) => {


    const { backdropStyle, showHideClassName } = useModal({show, onHide})
    const [observacion, setObservacion] = useState('')

    const onChangeInput = (event: any) => {
        setObservacion(event.target.value)
    }

    const onClickGuardar = () => {
        if(!observacion) {
            return toast.error("El campo de observacion esta vacio");
        }

        const objetoEncontrado = datoEditarObervacion.find(it => it.id === identificador.id)

        if (objetoEncontrado) {
            objetoEncontrado.observaciones = observacion;
            onHide();
        }
    }

    return (
        <>
            <div style={backdropStyle} onClick={onHide}></div>
            <div
                className={showHideClassName} 
                aria-labelledby="exampleModalLabel" 
                aria-hidden={!show}
                >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Observacion</h1>
                        <button onClick={onHide} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                            <FontAwesomeIcon icon={faXmark} />
                        </button>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="mb-3">
                                <label htmlFor="message-text" className="col-form-label">Observacion:</label>
                                <textarea value={observacion} onChange={onChangeInput} name='observaciones' placeholder='Ingresa la observacion...' className="form-control" id="message-text"></textarea>
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button onClick={onHide} type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
                        <button onClick={onClickGuardar} type="button" className="btn btn-outline-success">Guardar</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal