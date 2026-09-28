// src/pages/AdminLocationsPage.tsx
import { useEffect, useState } from 'react'
import { Pais, getPaisesApi, crearPaisApi, actualizarPaisApi, eliminarPaisApi } from '../services/api'

type Tab = 'paises' // en la rama 2 será 'paises' | 'departamentos', en la 3 se suma 'ciudades'

export default function AdminLocationsPage() {
  const [tab] = useState<Tab>('paises')

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-800 text-gray-900 mb-6">Ubicación geográfica</h1>
        {tab === 'paises' && <PaisesSection />}
      </div>
    </div>
  )
}

function PaisesSection() {
  const [paises, setPaises] = useState<Pais[]>([])
  const [nombre, setNombre] = useState('')
  const [editandoId, setEditandoId] = useState<number | null>(null)
  const [error, setError] = useState('')
  const [cargando, setCargando] = useState(false)

  const cargarPaises = () => {
    getPaisesApi().then(setPaises).catch((e) => setError(e.message))
  }

  useEffect(cargarPaises, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!nombre.trim()) return
    setCargando(true)
    try {
      if (editandoId) {
        await actualizarPaisApi(editandoId, nombre)
      } else {
        await crearPaisApi(nombre)
      }
      setNombre('')
      setEditandoId(null)
      cargarPaises()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    } finally {
      setCargando(false)
    }
  }

  const handleEditar = (pais: Pais) => {
    setEditandoId(pais.id_pais)
    setNombre(pais.nombre_pais)
  }

  const handleEliminar = async (id: number) => {
    setError('')
    try {
      await eliminarPaisApi(id)
      cargarPaises()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado')
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
      <h2 className="text-lg font-700 text-gray-900 mb-4">Países</h2>

      <form onSubmit={handleSubmit} className="flex gap-3 mb-6">
        <input
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Nombre del país"
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={cargando}
          className="text-sm font-600 text-white px-5 py-2 rounded-xl"
          style={{ background: '#4f46e5' }}
        >
          {editandoId ? 'Guardar' : 'Agregar'}
        </button>
        {editandoId && (
          <button
            type="button"
            onClick={() => { setEditandoId(null); setNombre('') }}
            className="text-sm font-600 text-gray-600 px-4 py-2 rounded-xl border border-gray-200"
          >
            Cancelar
          </button>
        )}
      </form>

      {error && <p className="text-sm text-red-600 mb-4">{error}</p>}

      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-400 border-b border-gray-100">
            <th className="py-2">Nombre</th>
            <th className="py-2 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {paises.map((p) => (
            <tr key={p.id_pais} className="border-b border-gray-50">
              <td className="py-2">{p.nombre_pais}</td>
              <td className="py-2 text-right">
                <button onClick={() => handleEditar(p)} className="text-indigo-600 mr-3">Editar</button>
                <button onClick={() => handleEliminar(p.id_pais)} className="text-red-600">Eliminar</button>
              </td>
            </tr>
          ))}
          {paises.length === 0 && (
            <tr><td colSpan={2} className="py-4 text-gray-400 text-center">Sin países registrados.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}