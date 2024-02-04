"use client";
import React, { useEffect } from 'react'
import { NavLink, NavbarBrand } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import Card from '../components/card';
import Table from '../components/table';
import { useAppDispatch } from '@/store/store';
import { thunkBockingState } from '@/thunks/thunkBockingState';

const Home = () => {

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(thunkBockingState({boki: '/LISTADO PAGOS BK.xlsx', reser: '/Reservas.xlsx', payCard: "Movimientos Tarjeta.xlsx"}))
    // dispatch(thunkReservasState('/Reservas.xlsx'))
  }, [])

  return (
    <>
      <Card />
      <Table />
    </>
  )
}

export default Home