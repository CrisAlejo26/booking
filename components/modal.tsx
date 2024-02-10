import useModal from '@/hooks/useModal';
import { ModalProps } from '@/interfaces';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'

const Modal: React.FC<ModalProps> = ({ show, onHide, datoEditarObervacion, identificador }) => {

    const { backdropStyle, showHideClassName, cerrarCampo, onChangeInput, onClickGuardar, observacion } = useModal({show, onHide, datoEditarObervacion, identificador})

    return (
        <>
            <div style={backdropStyle} onClick={cerrarCampo}></div>
            <div
                className={showHideClassName} 
                aria-labelledby="exampleModalLabel" 
                aria-hidden={!show}
                >
                <div className="modal-dialog">
                    <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Agregar Observacion</h1>
                        <button onClick={cerrarCampo} type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
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
                        <button onClick={cerrarCampo} type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Cerrar</button>
                        <button onClick={onClickGuardar} type="button" className="btn btn-outline-success">Guardar</button>
                    </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Modal