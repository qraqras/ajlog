import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { Routes, Route, Link } from 'react-router';
import { Scrum } from './scrum.tsx';
import { Dnd } from "./dnd.tsx";

function App() {
  return (
    <>
      <Routes>
        <Route path="/scrum" element={<Scrum />} />
        <Route path="/dnd" element={<Dnd />} />
      </Routes>
    </>
  )
}

export default App
