import React from 'react'
import './App.css'
import {Navigate, Route, Routes} from "react-router-dom";
import CarsListPage from "./pages/CarsListPage.tsx";
import CarDetailsPage from "./pages/CarDetailsPage.tsx";

function App() {

    return (
        <>
            <Routes>
                <Route path="/cars" element={<CarsListPage/>}/>
                <Route path="/cars/:id" element={<CarDetailsPage/>}/>
                <Route path="*" element={<Navigate to="/cars"/>}/>
            </Routes>
        </>
    )
}

export default App
