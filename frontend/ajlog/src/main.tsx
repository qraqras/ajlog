import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";

import './index.css'
import { Dnd } from "./dnd.tsx";

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <h1 className="text-3xl font-bold underline">AjLog</h1>
    <BrowserRouter>
      <Routes>
        <Route path="" element={<Dnd />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
