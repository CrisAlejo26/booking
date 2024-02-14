import { Tabla, TablaCompleta } from '@/interfaces';
import { useAppSelector } from '@/store/store';
import React, { useState } from 'react'

const useDataBase = () => {

    const [registros, setRegistros] = useState<TablaCompleta[]>([]);
    const { filasFiltradas } = useAppSelector(state => state.bocking);

    const verRegistroById = () => {

    }
    const verRegistros = () => {
        
    }

    const crearRegistro = async() => {
        try {
            const response = await fetch('/api/revisiones', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(filasFiltradas),
            });
    
            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }
    
            const respuesta = await response.json();
            console.log(respuesta);
            // Manejar la respuesta aquí
        } catch (error) {
            console.error('Error al enviar datos:', error);
        }
    }
    const editarRegistro = () => {

    }
    const actualizarRegistro = () => {

    }


    return {
        crearRegistro
    }
}

export default useDataBase