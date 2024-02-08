import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { CSSProperties } from 'react'

interface ModalProps {
    show: boolean;
    onHide: () => void;
}

const Modal: React.FC<ModalProps> = ({ show, onHide }) => {

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
                    <button onClick={onHide}type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close">
                        <FontAwesomeIcon icon={faXmark} />
                    </button>
                </div>
                <div className="modal-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="message-text" className="col-form-label">Observacion:</label>
                            <textarea placeholder='Ingresa la observacion...' className="form-control" id="message-text"></textarea>
                        </div>
                    </form>
                </div>
                <div className="modal-footer">
                    <button onClick={onHide} type="button" className="btn btn-outline-danger" data-bs-dismiss="modal">Close</button>
                    <button type="button" className="btn btn-outline-success">Send message</button>
                </div>
                </div>
            </div>
            </div>
        </>
    )
}

export default Modal