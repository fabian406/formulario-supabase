# Formulario con Supabase

Sistema de información básico: un formulario web (React + Vite + Tailwind) que guarda datos reales en una base de datos PostgreSQL de Supabase.

## 1. Cómo se conecta el sistema con la base de datos

```
Navegador (React)  ──HTTPS──▶  API REST de Supabase (PostgREST)  ──▶  PostgreSQL
   App.jsx                      https://xxxx.supabase.co               tabla "contactos"
```

1. **Credenciales.** En Supabase, *Project Settings → API* hay dos datos: la **URL del proyecto** y la **anon key** (clave pública). Se guardan en `.env` como `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.
2. **Cliente.** `src/supabaseClient.js` usa `createClient(url, anonKey)` de la librería `@supabase/supabase-js`. Ese objeto `supabase` es el único punto de conexión del sistema.
3. **Guardar (INSERT).** Al enviar el formulario, `App.jsx` ejecuta `supabase.from('contactos').insert([form])`. La librería convierte esa llamada en una petición HTTPS a la API de Supabase, que la traduce a un `INSERT` en PostgreSQL.
4. **Confirmación.** Tras guardar, la pantalla muestra durante 5 segundos solo el registro recién enviado. El navegador no lee la tabla; los registros se consultan en Supabase → *Table Editor → contactos*.
5. **Seguridad (RLS).** La anon key es pública, por eso la tabla tiene *Row Level Security* activado. Las políticas de `supabase.sql` solo permiten al rol `anon` insertar. No existe política de lectura, así que nadie puede leer los datos desde el navegador. La base valida además el formato (identificación y celular solo números).

## Campos del formulario

Nombres, apellidos, tipo de identificación (CC, TI, CE, RC), número de identificación (solo números), correo electrónico, celular (10 dígitos) y mensaje.

## 2. Estructura del proyecto

| Archivo | Función |
|---|---|
| `supabase.sql` | Crea la tabla `contactos` y las políticas de seguridad |
| `src/supabaseClient.js` | Conexión con Supabase |
| `src/App.jsx` | Formulario con validaciones y confirmación del registro guardado |
| `.env.example` | Plantilla de credenciales |

## 3. Puesta en marcha

1. Crear un proyecto en [supabase.com](https://supabase.com) y ejecutar `supabase.sql` en el **SQL Editor**.
2. Copiar `.env.example` a `.env` y poner tus credenciales.
3. Instalar y correr:
   ```bash
   npm install
   npm run dev
   ```
4. Enviar el formulario y verificar el registro en Supabase → *Table Editor → contactos*.

## 4. Publicar en GitHub

```bash
git init
git add .
git commit -m "Formulario con Supabase"
git branch -M main
git remote add origin https://github.com/TU-USUARIO/formulario-supabase.git
git push -u origin main
```

`.env` está en `.gitignore`, así que las credenciales no se suben. Para desplegar (Netlify, por ejemplo), agrega las dos variables `VITE_...` en la configuración del sitio.
