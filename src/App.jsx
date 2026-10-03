import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'

const vacio = { nombre: '', correo: '', mensaje: '' }

export default function App() {
  const [form, setForm] = useState(vacio)
  const [registros, setRegistros] = useState([])
  const [estado, setEstado] = useState('')

  async function cargar() {
    const { data, error } = await supabase
      .from('contactos')
      .select('*')
      .order('creado_en', { ascending: false })
    if (error) setEstado('Error al leer: ' + error.message)
    else setRegistros(data)
  }

  useEffect(() => { cargar() }, [])

  async function guardar(e) {
    e.preventDefault()
    setEstado('Guardando...')
    const { error } = await supabase.from('contactos').insert([form])
    if (error) return setEstado('Error al guardar: ' + error.message)
    setForm(vacio)
    setEstado('✅ Guardado en la base de datos')
    cargar()
  }

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const input = 'w-full border rounded-lg p-2'

  return (
    <main className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold">Formulario de contacto</h1>

      <form onSubmit={guardar} className="space-y-3">
        <input className={input} name="nombre" placeholder="Nombre"
          value={form.nombre} onChange={cambiar} required />
        <input className={input} name="correo" type="email" placeholder="Correo"
          value={form.correo} onChange={cambiar} required />
        <textarea className={input} name="mensaje" placeholder="Mensaje"
          value={form.mensaje} onChange={cambiar} required />
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg">Enviar</button>
        <p className="text-sm">{estado}</p>
      </form>

      <section>
        <h2 className="font-semibold mb-2">Registros guardados</h2>
        <ul className="space-y-2">
          {registros.map((r) => (
            <li key={r.id} className="border rounded-lg p-3">
              <b>{r.nombre}</b> · {r.correo}
              <p className="text-sm text-gray-600">{r.mensaje}</p>
            </li>
          ))}
        </ul>
      </section>
    </main>
  )
}
