import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="text-center p-8 bg-slate-800 rounded-2xl shadow-xl border border-slate-700">
        <h1 className="text-4xl font-bold text-emerald-400 mb-4">
          ¡Overclock HN Funcionando!
        </h1>
        <p className="text-slate-300 text-lg mb-6">
          Frontend en React + Vite + Tailwind CSS listo.
        </p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 px-6 rounded-lg transition-colors mt-5">
          Explorar Catálogo
        </button>
      </div>
    </div>
  )
}

export default App
