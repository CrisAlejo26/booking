"use client";
import React, { useEffect } from 'react'
import Card from '../../components/card';
import Table from '../../components/table';
import TableFilter from '@/components/tableFilterAdaptave';
import useDataBase from '@/hooks/useDataBase';
import { Button } from 'react-bootstrap';

const Page = () => {

    const { crearRegistro } = useDataBase()

    return (
        <>
        <Card />
        {/* <Table /> */}
        <TableFilter/>
        <Button color='success' onClick={crearRegistro}>Enviar informacion</Button>
        </>
    )
}

export default Page