# design.md — Diseño técnico y visual

## 1. Dirección general

El proyecto será una interfaz estática de cotización visual para un taller de enderezado y pintura.

La estética será oscura, sobria y minimalista, con una vibra de **premium garage**: técnica, limpia y seria. No debe parecer una landing genérica ni una maqueta infantil.

La pantalla se divide en cuatro zonas principales:

- Zona A: sidebar izquierdo para selección de modelo y ángulo.
- Zona B: área central grande para el vehículo.
- Zona C: panel derecho de cotización.
- Zona D: paleta inferior de pintura.

## 2. Arquitectura de archivos

```txt
index.html
css/variables.css
css/layout.css
css/palette.css
css/interactions.css
assets/img/
```

Responsabilidades:

- `variables.css`: tokens visuales, colores, radios, sombras, `--car-color`.
- `layout.css`: estructura global, CSS Grid, header, footer, cards, zona del vehículo.
- `palette.css`: paleta de colores usando Flexbox.
- `interactions.css`: estados `:checked`, `:hover`, `:focus-visible`, overlay, animaciones.

## 3. HTML semántico

La estructura base debe usar:

```html
<header class="site-header"></header>
<main class="app">
  <section class="showroom-grid">
    <aside class="selector-panel"></aside>
    <section class="vehicle-panel"></section>
    <aside class="quote-panel"></aside>
    <section class="paint-palette"></section>
  </section>
</main>
<footer class="site-footer"></footer>
```

Los `input type="radio"` globales deben ubicarse antes de `.app` para permitir selectores de hermanos generales:

```css
#model-corolla:checked ~ .app ...
#angle-front:checked ~ .app ...
#color-red:checked ~ .app ...
```

## 4. CSS Grid principal

La macroestructura debe estar controlada por CSS Grid.

Base sugerida:

```css
.showroom-grid {
  display: grid;
  grid-template-columns: minmax(170px, 220px) minmax(520px, 1fr) minmax(250px, 300px);
  grid-template-areas:
    "selector vehicle quote"
    "palette palette palette";
  gap: var(--space-3);
}
```

Áreas:

```css
.selector-panel { grid-area: selector; }
.vehicle-panel { grid-area: vehicle; }
.quote-panel { grid-area: quote; }
.paint-palette { grid-area: palette; grid-column: 1 / -1; }
```

El área del vehículo debe ser la protagonista visual.

## 5. Responsividad intrínseca

No se permite `@media`.

La adaptación debe resolverse con:

- `minmax()`.
- `clamp()`.
- `min()`.
- `max()`.
- `flex-wrap`.
- unidades relativas.
- límites de ancho con `width: min(...)`.

Ejemplo:

```css
.app {
  width: min(1180px, calc(100vw - 2rem));
}
```

## 6. Grid Overlay para vehículos

Cada modelo debe tener todas sus vistas en el DOM al mismo tiempo.

Estructura conceptual:

```html
<figure class="vehicle-display corolla-display">
  <img class="vehicle-angle angle-front" src="assets/img/corolla-gr-front.jpg" alt="Toyota Corolla GR visto de frente">
  <img class="vehicle-angle angle-side" src="assets/img/corolla-gr-side.jpg" alt="Toyota Corolla GR visto de perfil">
  <img class="vehicle-angle angle-rear" src="assets/img/corolla-gr-rear.jpg" alt="Toyota Corolla GR visto desde atrás">
  <img class="vehicle-angle angle-right" src="assets/img/corolla-gr-right.jpg" alt="Toyota Corolla GR visto del lado derecho">
</figure>
```

CSS conceptual:

```css
.vehicle-display {
  display: grid;
  place-items: center;
}

.vehicle-angle {
  grid-area: 1 / 1;
  opacity: 0;
  width: min(100%, 720px);
  max-height: 420px;
  object-fit: contain;
  transition: opacity 0.3s ease, filter 0.3s ease;
}
```

Activación:

```css
#angle-front:checked ~ .app .angle-front { opacity: 1; }
#angle-side:checked ~ .app .angle-side { opacity: 1; }
#angle-rear:checked ~ .app .angle-rear { opacity: 1; }
#angle-right:checked ~ .app .angle-right { opacity: 1; }
```

## 7. Cambio de modelo

Debe haber dos displays:

- `.corolla-display`.
- `.hilux-display`.

Solo el modelo activo debe estar visible.

```css
.vehicle-display {
  opacity: 0;
  pointer-events: none;
}

#model-corolla:checked ~ .app .corolla-display,
#model-hilux:checked ~ .app .hilux-display {
  opacity: 1;
  pointer-events: auto;
}
```

## 8. Cambio de color

La variable global `--car-color` debe cambiar según el radio activo:

```css
#color-red:checked ~ .app { --car-color: var(--car-color-red); }
#color-blue:checked ~ .app { --car-color: var(--car-color-blue); }
```

Como se usarán imágenes reales, el tintado debe hacerse con una capa sobria:

```html
<span class="paint-tint" aria-hidden="true"></span>
```

CSS sugerido:

```css
.paint-tint {
  grid-area: 1 / 1;
  width: min(100%, 720px);
  height: 70%;
  background: var(--car-color);
  opacity: 0.18;
  mix-blend-mode: color;
  pointer-events: none;
  transition: background-color 0.3s ease, opacity 0.3s ease;
}
```

Si el tintado sobre JPG no queda perfecto, mantenerlo sutil. Lo importante es que el cambio de variable sea visible y defendible.

## 9. Paleta con Flexbox

La paleta debe usar Flexbox:

```css
.palette-list {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-wrap: wrap;
  gap: var(--space-3);
}
```

Cada swatch debe ser:

```html
<label class="paint-swatch swatch-red">
  <input type="radio" name="paint-color" id="color-red">
  <span>Rojo</span>
</label>
```

El estado activo se controla con `:checked`.

## 10. Animación `floatIn`

La paleta debe cargar con animación:

```css
@keyframes floatIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

Aplicación:

```css
.paint-swatch {
  opacity: 0;
  animation: floatIn 0.4s ease forwards;
}
```

Usar delays escalonados:

```css
.paint-swatch:nth-child(1) { animation-delay: 0s; }
.paint-swatch:nth-child(2) { animation-delay: 0.06s; }
.paint-swatch:nth-child(3) { animation-delay: 0.12s; }
```

## 11. Cotización dinámica sin JavaScript

Crear dos bloques de cotización:

- `.quote-corolla`.
- `.quote-hilux`.

Ocultar ambos por defecto y mostrar el activo con CSS:

```css
.quote-card {
  display: none;
}

#model-corolla:checked ~ .app .quote-corolla,
#model-hilux:checked ~ .app .quote-hilux {
  display: block;
}
```

## 12. Búsqueda de imágenes

El agente puede navegar para encontrar imágenes reales de referencia o imágenes utilizables.

Criterios:

- Buscar cuatro ángulos por modelo.
- Preferir fuentes oficiales, Wikimedia Commons, catálogos con permiso académico o imágenes libres.
- Evitar marcas de agua.
- Evitar fotos con fondos complejos si rompen la consistencia visual.
- Guardar imágenes localmente en `assets/img/`.
- Renombrar imágenes a los nombres exactos definidos.
- Documentar fuentes en `docs/image-sources.md` si se descargan desde internet.

Consultas sugeridas:

```txt
Toyota Corolla GR 2024 front view transparent
Toyota Corolla GR 2024 side view
Toyota Corolla GR 2024 rear view
Toyota Corolla GR 2024 right side view
Toyota Hilux 4x4 SR 2024 front view
Toyota Hilux 4x4 SR 2024 side view
Toyota Hilux 4x4 SR 2024 rear view
Toyota Hilux 4x4 SR 2024 right side view
```

## 13. Estilo visual

Tokens sugeridos:

```css
:root {
  --color-bg: #050711;
  --color-surface: #101325;
  --color-surface-soft: #171a30;
  --color-border: #2a2f4a;
  --color-text: #f4f6fb;
  --color-muted: #8c93ad;
  --color-accent: #e63946;
  --color-accent-strong: #ff3b4f;
}
```

Detalles:

- Bordes finos.
- Cards con sombras suaves.
- Espaciado compacto.
- Header sobrio.
- Paleta visualmente limpia.
- Vehículo grande y centrado.
- Cotización clara tipo ficha técnica.
