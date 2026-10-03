import { useEffect, useRef, useState } from 'react'
import { supabase } from './supabaseClient'

const SEGUNDOS = 5
const TIPOS = [
  { valor: 'CC', texto: 'Cédula de ciudadanía' },
  { valor: 'TI', texto: 'Tarjeta de identidad' },
  { valor: 'CE', texto: 'Cédula de extranjería' },
  { valor: 'RC', texto: 'Registro civil' },
]
const SOLO_NUMEROS = ['numero_identificacion', 'celular']
const vacio = {
  nombres: '', apellidos: '', tipo_identificacion: '',
  numero_identificacion: '', correo: '', celular: '', mensaje: '',
}

const campo =
  'w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-slate-900 ' +
  'placeholder-slate-400 shadow-sm transition focus:border-indigo-500 ' +
  'focus:outline-none focus:ring-4 focus:ring-indigo-100'
const claseEtiqueta = 'mb-1.5 block text-sm font-medium text-slate-700'

function Campo({ id, etiqueta, children }) {
  return (
    <div>
      <label htmlFor={id} className={claseEtiqueta}>{etiqueta}</label>
      {children}
    </div>
  )
}

export default function App() {
  const [form, setForm] = useState(vacio)
  const [guardado, setGuardado] = useState(null)
  const [estado, setEstado] = useState(null) // { tipo: 'ok' | 'error', texto }
  const [enviando, setEnviando] = useState(false)
  const temporizador = useRef(null)

  useEffect(() => () => clearTimeout(temporizador.current), [])

  function cambiar(e) {
    const { name, value } = e.target
    setForm({ ...form, [name]: SOLO_NUMEROS.includes(name) ? value.replace(/\D/g, '') : value })
  }

  async function guardar(e) {
    e.preventDefault()
    setEnviando(true)
    setEstado(null)
    setGuardado(null)
    clearTimeout(temporizador.current)

    const { error } = await supabase.from('contactos').insert([form])
    setEnviando(false)
    if (error) {
      return setEstado({ tipo: 'error', texto: 'No se pudo guardar: ' + error.message })
    }

    setGuardado(form) // solo el registro recién guardado
    setForm(vacio)
    setEstado({ tipo: 'ok', texto: 'Guardado en la base de datos' })

    temporizador.current = setTimeout(() => {
      setGuardado(null)
      setEstado(null)
    }, SEGUNDOS * 1000)
  }

  return (
    <div className="min-h-screen px-4 py-10 sm:py-16">
      <main className="mx-auto w-full max-w-xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Formulario de registro
          </h1>
          <p className="mt-2 text-slate-500">
            Completa tus datos para guardarlos en la base de datos.
          </p>
        </header>

        <form
          onSubmit={guardar}
          className="space-y-5 rounded-2xl bg-white p-6 shadow-xl shadow-indigo-100/60 ring-1 ring-slate-200 sm:p-8"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <Campo id="nombres" etiqueta="Nombres">
              <input id="nombres" name="nombres" className={campo} placeholder="Tus nombres"
                value={form.nombres} onChange={cambiar} required />
            </Campo>
            <Campo id="apellidos" etiqueta="Apellidos">
              <input id="apellidos" name="apellidos" className={campo} placeholder="Tus apellidos"
                value={form.apellidos} onChange={cambiar} required />
            </Campo>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo id="tipo_identificacion" etiqueta="Tipo de identificación">
              <select id="tipo_identificacion" name="tipo_identificacion" className={campo}
                value={form.tipo_identificacion} onChange={cambiar} required>
                <option value="" disabled>Selecciona...</option>
                {TIPOS.map((t) => (
                  <option key={t.valor} value={t.valor}>{t.texto}</option>
                ))}
              </select>
            </Campo>
            <Campo id="numero_identificacion" etiqueta="Número de identificación">
              <input id="numero_identificacion" name="numero_identificacion" className={campo}
                inputMode="numeric" pattern="[0-9]{5,15}" title="Solo números (entre 5 y 15 dígitos)"
                placeholder="Solo números"
                value={form.numero_identificacion} onChange={cambiar} required />
            </Campo>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Campo id="correo" etiqueta="Correo electrónico">
              <input id="correo" name="correo" type="email" className={campo}
                placeholder="tucorreo@ejemplo.com"
                value={form.correo} onChange={cambiar} required />
            </Campo>
            <Campo id="celular" etiqueta="Número de celular">
              <input id="celular" name="celular" className={campo}
                inputMode="tel" maxLength={10} pattern="[0-9]{10}" title="10 dígitos, solo números"
                placeholder="3001234567"
                value={form.celular} onChange={cambiar} required />
            </Campo>
          </div>

          <Campo id="mensaje" etiqueta="Mensaje">
            <textarea id="mensaje" name="mensaje" rows={4} className={campo + ' resize-none'}
              placeholder="Escribe tu mensaje"
              value={form.mensaje} onChange={cambiar} required />
          </Campo>

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

        {guardado && (
          <section className="aparecer mt-6 rounded-2xl bg-white p-5 shadow-lg ring-1 ring-slate-200">
            <h2 className="mb-3 font-semibold text-slate-900">Registro guardado</h2>
            <div className="space-y-1 rounded-xl bg-slate-50 px-4 py-3 text-sm ring-1 ring-slate-200">
              <p><b className="text-slate-900">{guardado.nombres} {guardado.apellidos}</b></p>
              <p className="text-slate-500">
                {TIPOS.find((t) => t.valor === guardado.tipo_identificacion)?.texto} · {guardado.numero_identificacion}
              </p>
              <p className="text-slate-500">{guardado.correo} · {guardado.celular}</p>
              <p className="text-slate-600">{guardado.mensaje}</p>
            </div>
            <div className="mt-4"><div className="barra" /></div>
          </section>
        )}
      </main>
    </div>
  )
}
