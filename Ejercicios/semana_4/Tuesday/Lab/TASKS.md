# TASKS — Lab3 Clon Dashboard de Monitoreo Hídrico con Flexbox

## Objetivo de esta versión

Construir el dashboard lo más cercano posible al resultado esperado del profesor: interfaz oscura, tecnológica, con barra superior, sidebar izquierdo, área central de monitoreo, panel derecho de alertas, gráfico visual simulado, footer y etiquetas educativas de Flexbox.

La marca personal se agrega sin romper las reglas del laboratorio: **Predicción Inteligente** e **Historial de Eventos** deben ser bloques visuales hechos con HTML + CSS puro, sin JavaScript y sin frameworks.

---

## Estado General

- [ ] EJ1: Barra de navegación clonada visualmente
- [ ] EJ2: Grid de sensores con estilo oscuro y tarjetas tipo dashboard IoT
- [ ] EJ3: Layout de tres columnas igual al anexo visual
- [ ] EJ4: Responsive móvil completo
- [ ] Marca personal: Predicción Inteligente
- [ ] Marca personal: Historial de Eventos
- [ ] Calidad, validación y entrega final

---

## EJ1 · Barra de Navegación

**Archivos:** `index.html` + `styles.css`  
**Valor:** 25 puntos

### HTML obligatorio

- [ ] Crear `<nav class="navbar">` como primer hijo visible del `<body>`.
- [ ] Agregar `<div class="nav-logo"><span>💧 AcueductosIoT</span></div>`.
- [ ] Agregar `<ul class="nav-links">` con cuatro enlaces:
  - `Inicio`
  - `Sensores`
  - `Alertas`
  - `Reportes`
- [ ] Agregar `<button class="btn-logout">Cerrar Sesión</button>`.
- [ ] Agregar una etiqueta visual superior tipo laboratorio:
  - `EJERCICIO 1 — DISPLAY:FLEX · JUSTIFY-CONTENT:SPACE-BETWEEN · ALIGN-ITEMS:CENTER`

### CSS obligatorio

- [ ] `.navbar` con `display: flex`.
- [ ] `.navbar` con `justify-content: space-between`.
- [ ] `.navbar` con `align-items: center`.
- [ ] `.navbar` con `min-height: 60px`.
- [ ] `.nav-links` con `display: flex`.
- [ ] `.nav-links` con `gap: 24px`.
- [ ] `.nav-links` con `list-style: none`.
- [ ] Quitar `padding` y `margin` por defecto del `<ul>`.
- [ ] Usar fondo azul oscuro, borde inferior cyan y texto claro.
- [ ] Botón con borde sutil, fondo oscuro y hover visible.

### Comentario CSS obligatorio

- [ ] Explicar qué hace `justify-content: space-between` en este contexto.

### Entregable

- [ ] Captura `capturas/ej1-navbar.png` mostrando logo izquierda, links centro y botón derecha en la misma línea visual.

---

## EJ2 · Cuadrícula de Sensores IoT

**Archivos:** `index.html` + `styles.css`  
**Valor:** 25 puntos

### HTML obligatorio

Crear `<section class="sensor-grid">` dentro del contenido central del dashboard, no aislada como bloque blanco. Debe verse integrada al clon oscuro.

Cada tarjeta debe seguir esta estructura mínima:

```html
<div class="sensor-card">
  <h3>[ícono] [nombre del sensor]</h3>
  <p class="sensor-value">[valor]</p>
  <p class="sensor-label">[descripción — tiempo]</p>
</div>
```

### Sensores para clonar el anexo visual

- [ ] `💧 Nivel Tanque Principal` — `73%` — `✓ Sector A · 2 min`
- [ ] `⚡ Presión Red Calle 2` — `28 PSI` — `⚠ Mín: 30 PSI · 1 min`
- [ ] `🧪 Cloro Residual` — `0.4 mg/L` — `✓ Rango: 0.3–0.5 · 3 min`
- [ ] `🌊 Caudal Naciente Sur` — `142 L/min` — `→ Normal · 4 min`
- [ ] `🌡️ Temperatura Agua` — `18.2°C` — `ℹ Normal · 5 min`
- [ ] `🔧 Válvula Emergencia` — `CERRADA` — `✓ Estado normal · 1 min`

### Extras visuales permitidos

- [ ] Agregar mini barras de estado al fondo de cada tarjeta.
- [ ] Usar colores por estado:
  - Verde: normal
  - Naranja: advertencia
  - Azul/violeta: información
  - Rojo: crítico
- [ ] Agregar etiqueta visual sobre la grid:
  - `EJERCICIO 2 — FLEX-WRAP:WRAP · GAP:14PX · FLEX-BASIS:CALC(33%...)`

### CSS obligatorio

- [ ] `.sensor-grid` con `display: flex`.
- [ ] `.sensor-grid` con `flex-wrap: wrap`.
- [ ] `.sensor-grid` con `gap: 14px` o `gap: 16px`.
- [ ] `.sensor-card` con `flex-basis: calc(33.333% - 16px)`.
- [ ] No usar `margin: 8px` como hack de espaciado.
- [ ] No usar `float`.
- [ ] No usar `position: absolute` para ubicar tarjetas.

### Exploración obligatoria

- [ ] Probar `flex-basis: 48%` y capturar resultado de 2 columnas.
- [ ] Probar `flex-basis: 100%` y capturar resultado de 1 columna.
- [ ] Restaurar `flex-basis: calc(33.333% - 16px)` para la entrega final.

### Comentario CSS obligatorio

- [ ] Explicar la diferencia entre `align-items` y `align-content`.

### Entregables

- [ ] `capturas/ej2-grid-3col.png`
- [ ] `capturas/ej2-grid-2col.png`
- [ ] `capturas/ej2-grid-1col.png`

---

## EJ3 · Layout Principal de Tres Columnas

**Archivos:** `index.html` + `styles.css`  
**Valor:** 25 puntos

### HTML obligatorio

Crear la estructura:

```html
<div class="dashboard-layout">
  <aside class="sidebar">...</aside>
  <main class="main-content">...</main>
  <aside class="alert-panel">...</aside>
</div>
```

### Sidebar izquierdo

- [ ] Menú con título `MENÚ`.
- [ ] Opciones:
  - `📊 Resumen`
  - `💧 Tanques`
  - `⚡ Presiones`
  - `🧪 Calidad`
  - `🗺️ Mapa Red`
  - `⚙️ Configuración`
- [ ] Versión al fondo: `v2.4.1 · Online`.
- [ ] Etiqueta visual: `FLEX: 1`.

### Main central

- [ ] Título: `Monitoreo en Tiempo Real`.
- [ ] Estado tipo pill: `● En vivo`.
- [ ] Grid de sensores dentro del main.
- [ ] Gráfico simulado con título `Presión de Red — Últimas 6 horas`.
- [ ] Valor actual visible: `28 PSI`.
- [ ] Línea/área de gráfico creada con HTML + CSS, SVG o bloques decorativos. No necesita datos reales.
- [ ] Etiqueta visual: `FLEX: 3 — SENSOR GRID (EJERCICIO 2) + GRÁFICO`.

### Alert panel derecho

- [ ] Título `🔔 ALERTAS ACTIVAS`.
- [ ] Badge rojo con número `2`.
- [ ] Alertas:
  - `⚠ Presión baja — Calle 2`
  - `⚡ Fluctuación detectada`
  - `✓ Cloro en rango normal`
  - `✓ Tanque Principal OK`
- [ ] Bloque inferior de próxima actualización: `00:47`.
- [ ] Etiqueta visual: `FLEX: 1`.

### CSS obligatorio

- [ ] `.dashboard-layout` con `display: flex`.
- [ ] `.dashboard-layout` con `flex-direction: row`.
- [ ] `.dashboard-layout` con `min-height: calc(100vh - 60px)`.
- [ ] `.sidebar` con `flex: 1`.
- [ ] `.main-content` con `flex: 3`.
- [ ] `.alert-panel` con `flex: 1`.
- [ ] No usar `width: 20%`, `width: 60%` ni anchos fijos en píxeles para columnas.
- [ ] Se permite usar `min-width` como protección, según la pregunta de reflexión.

### Preguntas de reflexión en comentarios CSS

- [ ] ¿Qué diferencia hay entre `flex: 1` y `flex-grow: 1`? ¿Son exactamente lo mismo?
- [ ] Si el sidebar nunca debe ser menor a `180px`, ¿qué propiedad agregarían?
- [ ] ¿Qué pasa visualmente si `.main-content` cambia de `flex: 3` a `flex: 5`?

### Entregable

- [ ] `capturas/ej3-layout-desktop.png`

---

## Marca personal · Predicción Inteligente

Este bloque debe sentirse como una mejora real del dashboard, pero sin incumplir la restricción de no usar JavaScript.

### Ubicación recomendada

Dentro de `.main-content`, debajo del gráfico o al lado del historial si el espacio lo permite.

### HTML sugerido

```html
<section class="prediction-card" aria-labelledby="prediction-title">
  <h3 id="prediction-title">🧠 Predicción Inteligente</h3>
  <p class="prediction-score">Riesgo moderado · 68%</p>
  <p>La presión de Calle 2 podría mantenerse bajo el umbral durante los próximos 30 minutos.</p>
</section>
```

### CSS requerido

- [ ] Usar `display: flex` para ordenar texto e indicador.
- [ ] No usar JavaScript.
- [ ] No venderlo como IA real; debe ser una simulación visual del dashboard.
- [ ] Mantener colores del sistema: cyan, verde y naranja.

---

## Marca personal · Historial de Eventos

### Ubicación recomendada

Dentro de `.main-content` o en el `.alert-panel`, según quede más limpio visualmente.

### HTML sugerido

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

### CSS requerido

- [ ] Usar `display: flex` en la lista o en cada evento.
- [ ] Mantener jerarquía visual clara.
- [ ] No reemplazar las alertas obligatorias del profesor; esto es adicional.

---

## EJ4 · Responsive Móvil

**Archivo:** `styles.css`  
**Valor:** +15 puntos bonus

### CSS obligatorio

- [ ] Agregar al final:

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
}
```

### Extra recomendado

- [ ] En móvil, `.sensor-card` debe pasar a `flex-basis: 100%`.
- [ ] En tablet, `.sensor-card` puede usar `flex-basis: calc(50% - 16px)`.
- [ ] El navbar puede usar `flex-wrap: wrap` para no romperse.

### Comentario CSS obligatorio

- [ ] Explicar por qué se usa `min-height: 100vh` en lugar de `height: 100vh`.

### Entregables

- [ ] `capturas/ej4-desktop.png`
- [ ] `capturas/ej4-mobile.png`

---

## Calidad y Entrega Final

### Código

- [ ] HTML5 semántico.
- [ ] CSS externo en `styles.css`.
- [ ] Sin estilos inline.
- [ ] Sin frameworks.
- [ ] Sin JavaScript.
- [ ] Sin `float`.
- [ ] Sin `position: absolute/fixed` para layout o centrado.
- [ ] Clases en `kebab-case`.
- [ ] Comentarios CSS por sección.
- [ ] Indentación consistente.

### Validación

- [ ] Validar `index.html` en W3C Validator.
- [ ] Resolver errores mayores.
- [ ] Revisar responsive con DevTools.

### Capturas obligatorias

- [ ] `capturas/ej1-navbar.png`
- [ ] `capturas/ej2-grid-3col.png`
- [ ] `capturas/ej2-grid-2col.png`
- [ ] `capturas/ej2-grid-1col.png`
- [ ] `capturas/ej3-layout-desktop.png`
- [ ] `capturas/ej4-desktop.png`
- [ ] `capturas/ej4-mobile.png`

### Empaquetado

- [ ] Carpeta: `Apellido_Nombre_Lab3_ISW521/`
- [ ] Contenido obligatorio:
  - `index.html`
  - `styles.css`
  - `capturas/`
- [ ] ZIP final: `Apellido_Nombre_Lab3_ISW521.zip`

---

## Checklist anti-pérdida-de-puntos

- [ ] El dashboard se parece al anexo visual oscuro del profesor.
- [ ] Las etiquetas de Flexbox están visibles como guía educativa.
- [ ] Las tarjetas están dentro del dashboard, no como cards blancas separadas.
- [ ] El gráfico simulado existe.
- [ ] El panel derecho tiene cuatro alertas visuales.
- [ ] Predicción Inteligente e Historial de Eventos están agregados como marca personal.
- [ ] La marca personal no elimina ningún requisito del laboratorio.
- [ ] El layout principal usa `flex: 1 / flex: 3 / flex: 1`.
- [ ] La grid usa `flex-wrap` y `flex-basis`.
- [ ] La versión móvil apila las columnas correctamente.
