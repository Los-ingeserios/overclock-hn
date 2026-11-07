# 💻 Frontend - Overclock HN (React + Vite + Tailwind)

Bienvenidos al Frontend. Aquí consumiremos la API de Django para maquetar el Catálogo, el Carrito y el Dashboard Analítico.

## 🚀 Pasos para levantar el entorno local

**1. Instalar Node Modules**
La primera vez que clones el repositorio, o si alguien instaló una nueva librería (como Axios o React Router), debes instalar las dependencias:
```bash
npm install
```
2. Levantar el Servidor de Desarrollo (Vite)

```Bash
npm run dev
```
Esto abrirá la aplicación en http://localhost:5173/.

### Reglas de Desarrollo
**Estilos**: Estamos usando Tailwind CSS. No crees archivos .css puros a menos que sea estrictamente necesario. Usa las clases utilitarias de Tailwind directamente en el className de los componentes.

**Componentes**: Si un botón o tarjeta se repite mucho, sácalo a la carpeta /src/components/ para reutilizarlo.

**Peticiones**: Usaremos axios para pegarle a la API de Django. Las peticiones irán en la carpeta /src/services/.