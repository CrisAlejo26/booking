import React, { CSSProperties } from 'react'

interface Shows {
    show: any;
    onHide: any;
}

const useModal = ({show, onHide}: Shows) => {

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

    return {
        showHideClassName,
        backdropStyle
    }
}

export default useModal