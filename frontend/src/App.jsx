import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Testers from './pages/Testers.jsx'
import TestCases from './pages/TestCases.jsx'
import ChatBot from './components/ChatBot.jsx'
import UploadPDFs from './pages/UploadPDFs.jsx'

import './App.css'


function App() {


  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path='testers' element={<Testers />} />
        <Route path='test-cases' element={<TestCases />} />
        <Route path='dashboard' element={<Dashboard />} />
        <Route path='/' element={<Dashboard />} />
        <Route path='upload-pdf' element={<UploadPDFs />} />
        <Route path='chatbot' element={<ChatBot />} />
        <Route path='*' element={<h1>Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App


// Falta agregar el link del chatbot en el navbar