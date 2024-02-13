"use client";
import React, { useEffect } from 'react'
import Card from '../../components/card';
import Table from '../../components/table';
import TableFilter from '@/components/tableFilterAdaptave';

const Page = () => {

    return (
        <>
        <Card />
        {/* <Table /> */}
        <TableFilter/>
        </>
    )
}

export default Page