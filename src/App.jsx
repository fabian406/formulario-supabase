import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

const vacio = { nombre: '', correo: '', mensaje: '' }
const SEGUNDOS = 5

export default function App() {
  const [form, setForm] = useState(vacio)
  const [registros, setRegistros] = useState([])
  const [estado, setEstado] = useState(null) // { tipo: 'ok' | 'error', texto }
  const [enviando, setEnviando] = useState(false)
  const [visible, setVisible] = useState(false)
  const temporizador = useRef(null)

  useEffect(() => () => clearTimeout(temporizador.current), [])

  async function guardar(e) {
    e.preventDefault()
    setEnviando(true)
    setEstado(null)
    setVisible(false)
    clearTimeout(temporizador.current)

    const { error } = await supabase.from('contactos').insert([form])
    if (error) {
      setEnviando(false)
      return setEstado({ tipo: 'error', texto: 'No se pudo guardar: ' + error.message })
    }

    const { data } = await supabase
      .from('contactos')
      .select('*')
      .order('creado_en', { ascending: false })

    setRegistros(data ?? [])
    setForm(vacio)
    setEstado({ tipo: 'ok', texto: 'Guardado en la base de datos' })
    setVisible(true)
    setEnviando(false)

    // Después de 5 segundos se oculta todo
    temporizador.current = setTimeout(() => {
      setVisible(false)
      setEstado(null)
      setRegistros([])
    }, SEGUNDOS * 1000)
  }

  const cambiar = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const campo =
    'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 ' +
    'placeholder-slate-400 shadow-sm transition focus:border-indigo-500 ' +
    'focus:outline-none focus:ring-4 focus:ring-indigo-100'
  const etiqueta = 'mb-1.5 block text-sm font-medium text-slate-700'

  return (
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <main className="mx-auto w-full max-w-lg">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Formulario de contacto
          </h1>
          <p className="mt-2 text-slate-500">
            Déjanos tus datos y los guardaremos en la base de datos.
          </p>
        </header>

        <form
          onSubmit={guardar}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-200 sm:p-8"
        >
          <div>
            <label htmlFor="nombre" className={etiqueta}>Nombre</label>
            <input id="nombre" name="nombre" className={campo} placeholder="Tu nombre"
              value={form.nombre} onChange={cambiar} required />
          </div>

          <div>
            <label htmlFor="correo" className={etiqueta}>Correo</label>
            <input id="correo" name="correo" type="email" className={campo}
              placeholder="tucorreo@ejemplo.com"
              value={form.correo} onChange={cambiar} required />
          </div>

          <div>
            <label htmlFor="mensaje" className={etiqueta}>Mensaje</label>
            <textarea id="mensaje" name="mensaje" rows={4} className={campo + ' resize-none'}
              placeholder="Escribe tu mensaje"
              value={form.mensaje} onChange={cambiar} required />
          </div>

          <button
            type="submit"
            disabled={enviando}
            className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 font-semibold text-white shadow-lg shadow-indigo-600/25 transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 active:scale-[.98] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {enviando ? (<><span className="spinner" /> Guardando...</>) : 'Enviar'}
          </button>

          {estado && (
            <div
              role="status"
              className={
                'aparecer rounded-xl px-4 py-3 text-sm font-medium ' +
                (estado.tipo === 'ok'
                  ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                  : 'bg-red-50 text-red-700 ring-1 ring-red-200')
              }
            >
              {estado.tipo === 'ok' ? '✅ ' : '⚠️ '}{estado.texto}
            </div>
          )}
        </form>

        {visible && (
          <section className="aparecer mt-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
            <h2 className="mb-3 font-semibold text-slate-900">Registros guardados</h2>
            <ul className="max-h-64 space-y-2 overflow-y-auto">
              {registros.map((r) => (
                <li key={r.id} className="rounded-xl bg-slate-50 px-4 py-3 ring-1 ring-slate-200">
                  <p className="text-sm">
                    <b className="text-slate-900">{r.nombre}</b>
                    <span className="text-slate-500"> · {r.correo}</span>
                  </p>
                  <p className="mt-0.5 text-sm text-slate-600">{r.mensaje}</p>
                </li>
              ))}
            </ul>
            <div className="mt-4"><div className="barra" /></div>
          </section>
        )}
      </main>
    </div>
  )
}
