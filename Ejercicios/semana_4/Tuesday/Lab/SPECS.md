# SPEC — Clon del Dashboard de Monitoreo Hídrico con Flexbox

## Contexto

Aplicación web frontend sin frameworks para simular un dashboard IoT de monitoreo hídrico. El objetivo es replicar el resultado visual esperado del laboratorio: un sistema oscuro, técnico y responsivo construido exclusivamente con CSS Flexbox.

El clon debe respetar las reglas del profesor y, además, agregar una marca personal sobria: **Predicción Inteligente** e **Historial de Eventos**.

---

## Reglas base del laboratorio

- Usar HTML5 semántico.
- Usar CSS3 puro.
- Usar Flexbox como sistema principal de layout.
- No usar frameworks.
- No usar JavaScript.
- No usar `float`.
- No usar `position: absolute` ni `position: fixed` para maquetar columnas, centrar elementos o simular layouts.
- No usar estilos inline.
- El archivo CSS debe ser externo: `styles.css`.
- El HTML debe validar sin errores mayores en W3C Validator.

---

## Estructura final de archivos

```text
Apellido_Nombre_Lab3_ISW521/
├── index.html
├── styles.css
└── capturas/
    ├── ej1-navbar.png
    ├── ej2-grid-3col.png
    ├── ej2-grid-2col.png
    ├── ej2-grid-1col.png
    ├── ej3-layout-desktop.png
    ├── ej4-desktop.png
    └── ej4-mobile.png
```

---

## Apariencia general del clon

### Estilo visual

El diseño debe parecer un panel de control operativo en tiempo real, no una página administrativa genérica.

**Dirección visual:**

- Fondo principal azul oscuro / navy.
- Tarjetas con borde cyan o azul brillante.
- Texto principal claro.
- Valores normales en verde.
- Advertencias en naranja.
- Alertas críticas en rojo.
- Tipografía sans-serif moderna.
- Bordes redondeados moderados.
- Sombras suaves.
- Efectos hover sutiles.

### Paleta sugerida

```css
:root {
  --bg-main: #07111f;
  --bg-panel: #102541;
  --bg-card: #0d213a;
  --cyan: #18d6d0;
  --green: #28e17d;
  --orange: #f4a51c;
  --red: #ff4d5e;
  --text-main: #e8f3ff;
  --text-muted: #8aa6c5;
  --border-soft: rgba(24, 214, 208, 0.35);
}
```

---

## Layout macro obligatorio

El dashboard se compone de cuatro zonas principales:

```text
┌──────────────────────────────────────────────────────────────┐
│ Navbar superior                                               │
├───────────────┬──────────────────────────────┬───────────────┤
│ Sidebar       │ Main content                 │ Alert panel   │
│ flex: 1       │ flex: 3                      │ flex: 1       │
├───────────────┴──────────────────────────────┴───────────────┤
│ Footer                                                        │
└──────────────────────────────────────────────────────────────┘
```

La estructura debe usar:

```html
<nav class="navbar">...</nav>
<div class="dashboard-layout">
  <aside class="sidebar">...</aside>
  <main class="main-content">...</main>
  <aside class="alert-panel">...</aside>
</div>
<footer class="dashboard-footer">...</footer>
```

---

## EJ1 — Navbar superior

### HTML requerido

```html
<nav class="navbar">
  <div class="nav-logo">
    <span>💧 AcueductosIoT</span>
  </div>

  <ul class="nav-links">
    <li><a href="#">Inicio</a></li>
    <li><a href="#">Sensores</a></li>
    <li><a href="#">Alertas</a></li>
    <li><a href="#">Reportes</a></li>
  </ul>

  <button class="btn-logout">Cerrar Sesión</button>
</nav>
```

### CSS requerido

```css
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 60px;
}

.nav-links {
  display: flex;
  gap: 24px;
  list-style: none;
  margin: 0;
  padding: 0;
}
```

### Resultado esperado

- Logo a la izquierda.
- Links centrados visualmente.
- Botón a la derecha.
- Todo alineado verticalmente al centro.
- Etiqueta visual educativa sobre el navbar:

```text
EJERCICIO 1 — DISPLAY:FLEX · JUSTIFY-CONTENT:SPACE-BETWEEN · ALIGN-ITEMS:CENTER
```

---

## EJ2 — Grid de sensores

### Ubicación

El grid debe ir dentro de `.main-content`, debajo del título `Monitoreo en Tiempo Real`.

### HTML base requerido

```html
<section class="sensor-grid" aria-label="Sensores IoT principales">
  <div class="sensor-card">
    <h3>💧 Nivel Tanque Principal</h3>
    <p class="sensor-value">73%</p>
    <p class="sensor-label">✓ Sector A · 2 min</p>
  </div>
</section>
```

### Sensores definitivos del clon

| Sensor | Valor | Descripción |
|---|---:|---|
| 💧 Nivel Tanque Principal | 73% | ✓ Sector A · 2 min |
| ⚡ Presión Red Calle 2 | 28 PSI | ⚠ Mín: 30 PSI · 1 min |
| 🧪 Cloro Residual | 0.4 mg/L | ✓ Rango: 0.3–0.5 · 3 min |
| 🌊 Caudal Naciente Sur | 142 L/min | → Normal · 4 min |
| 🌡️ Temperatura Agua | 18.2°C | ℹ Normal · 5 min |
| 🔧 Válvula Emergencia | CERRADA | ✓ Estado normal · 1 min |

### CSS requerido

```css
.sensor-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.sensor-card {
  flex-basis: calc(33.333% - 16px);
}
```

### Comportamiento esperado

- En escritorio: 3 columnas × 2 filas.
- En exploración: 2 columnas usando `flex-basis: 48%`.
- En exploración: 1 columna usando `flex-basis: 100%`.
- En móvil: 1 columna mediante media query.

---

## EJ3 — Layout de tres columnas

### HTML requerido

```html
<div class="dashboard-layout">
  <aside class="sidebar">...</aside>
  <main class="main-content">...</main>
  <aside class="alert-panel">...</aside>
</div>
```

### CSS requerido

```css
.dashboard-layout {
  display: flex;
  flex-direction: row;
  min-height: calc(100vh - 60px);
}

.sidebar {
  flex: 1;
}

.main-content {
  flex: 3;
}

.alert-panel {
  flex: 1;
}
```

### Prohibiciones específicas

No usar:

```css
width: 20%;
width: 60%;
width: 200px;
float: left;
position: absolute;
```

### Sidebar

Debe contener:

```text
MENÚ
📊 Resumen
💧 Tanques
⚡ Presiones
🧪 Calidad
🗺️ Mapa Red
⚙️ Configuración
```

También puede incluir:

```text
v2.4.1 · Online
```

### Main content

Debe contener:

```text
Monitoreo en Tiempo Real
● En vivo
Grid de sensores
Presión de Red — Últimas 6 horas
28 PSI
```

### Gráfico simulado

Puede hacerse con:

- Un bloque `.chart-card`.
- Un `<svg>` simple.
- Líneas decorativas CSS.
- Etiquetas horarias simuladas.

No debe depender de JavaScript.

### Panel derecho

Debe contener:

```text
🔔 ALERTAS ACTIVAS    2
⚠ Presión baja — Calle 2
⚡ Fluctuación detectada
✓ Cloro en rango normal
✓ Tanque Principal OK
Próxima actualización 00:47
```

---

## Marca personal 1 — Predicción Inteligente

### Propósito

Agregar una sección que haga sentir el dashboard más avanzado sin romper el alcance del laboratorio.

### Regla importante

Debe presentarse como simulación visual, no como IA funcional real.

### Ubicación

Dentro de `.main-content`, preferiblemente debajo del gráfico.

### HTML recomendado

```html
<section class="prediction-card" aria-labelledby="prediction-title">
  <div>
    <h3 id="prediction-title">🧠 Predicción Inteligente</h3>
    <p>La presión de Calle 2 podría mantenerse bajo el umbral durante los próximos 30 minutos.</p>
  </div>
  <strong>68%</strong>
</section>
```

### CSS esperado

```css
.prediction-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
```

### Resultado visual

Debe verse como una tarjeta técnica pequeña:

```text
🧠 Predicción Inteligente
Riesgo moderado de presión baja en Calle 2
68%
```

---

## Marca personal 2 — Historial de Eventos

### Propósito

Mostrar actividad reciente del sistema para que el dashboard parezca vivo.

### Ubicación

Dentro de `.main-content` o debajo de las alertas del panel derecho.

### HTML recomendado

```html
<section class="event-history" aria-labelledby="history-title">
  <h3 id="history-title">📜 Historial de Eventos</h3>
  <ul>
    <li><span>05:13</span> Presión bajó a 28 PSI en Calle 2.</li>
    <li><span>05:10</span> Cloro residual estable.</li>
    <li><span>05:03</span> Tanque principal actualizado.</li>
  </ul>
</section>
```

### CSS esperado

```css
.event-history li {
  display: flex;
  justify-content: space-between;
  gap: 12px;
}
```

### Resultado visual

Debe sentirse como bitácora operativa:

```text
05:13 — Presión bajó a 28 PSI
05:10 — Cloro residual estable
05:03 — Tanque principal actualizado
```

---

## EJ4 — Responsive móvil

### CSS requerido

```css
@media (max-width: 768px) {
  body {
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .dashboard-layout {
    flex-direction: column;
  }

  .sidebar,
  .alert-panel {
    flex: none;
    width: 100%;
    min-height: auto;
  }

  .main-content {
    flex: 1;
  }

  .sensor-card {
    flex-basis: 100%;
  }
}
```

### Resultado esperado

- Navbar no se rompe.
- Sidebar, main y alert panel se apilan verticalmente.
- Las tarjetas de sensores pasan a una columna.
- El footer queda al fondo si hay poco contenido.

---

## Comentarios CSS obligatorios

El archivo `styles.css` debe incluir comentarios propios que respondan:

### Navbar

```css
/* justify-content: space-between reparte el logo, los links y el botón dejando el mayor espacio posible entre ellos. */
```

### Grid

```css
/* align-items alinea los elementos dentro de cada fila; align-content reparte el espacio entre filas cuando hay flex-wrap. */
```

### Layout

```css
/* flex: 1 no es exactamente igual a flex-grow: 1; flex también define shrink y basis. */
/* Para evitar que el sidebar baje de 180px se puede usar min-width: 180px. */
/* Si main-content cambia a flex: 5, el centro recibe más porciones de espacio y las columnas laterales se ven más estrechas. */
```

### Responsive

```css
/* min-height: 100vh permite crecer si el contenido supera la pantalla; height: 100vh podría recortar contenido. */
```

---

## Criterios de aceptación visual

- El resultado debe parecerse al anexo visual del laboratorio.
- El fondo no debe ser blanco en la versión final.
- La barra superior debe estar alineada con Flexbox.
- La grid debe estar dentro del main y verse como panel de sensores.
- El layout principal debe tener tres columnas en escritorio.
- El panel derecho debe tener alertas con severidad visual.
- Debe existir un gráfico simulado.
- Debe existir footer.
- Deben existir etiquetas educativas de Flexbox.
- Deben existir Predicción Inteligente e Historial de Eventos como marca personal.

---

## Capturas finales necesarias

```text
capturas/ej1-navbar.png
capturas/ej2-grid-3col.png
capturas/ej2-grid-2col.png
capturas/ej2-grid-1col.png
capturas/ej3-layout-desktop.png
capturas/ej4-desktop.png
capturas/ej4-mobile.png
```

---

## Entrega final

Comprimir la carpeta como:

```text
Apellido_Nombre_Lab3_ISW521.zip
```

Debe incluir:

```text
index.html
styles.css
capturas/
```

No incluir:

```text
node_modules/
.env
archivos temporales
capturas repetidas o con nombres incorrectos
```
