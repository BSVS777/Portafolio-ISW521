# tasks.md — Plan de implementación Gentle-AI

## Fase 0 — Preparación

- [ ] Inspeccionar carpeta actual.
- [ ] Confirmar si el proyecto está vacío o tiene archivos previos.
- [ ] No modificar archivos antes de entender la estructura.
- [ ] Verificar si existen imágenes en `assets/img/`.
- [ ] Confirmar que no existe `package.json`.
- [ ] Confirmar que no existen archivos `.js`.

Comandos útiles:

```bash
find . -maxdepth 3 -type f
```

## Fase 1 — Crear estructura base

- [ ] Crear `index.html`.
- [ ] Crear carpeta `css/`.
- [ ] Crear `css/variables.css`.
- [ ] Crear `css/layout.css`.
- [ ] Crear `css/palette.css`.
- [ ] Crear `css/interactions.css`.
- [ ] Crear carpeta `assets/img/`.
- [ ] Enlazar los cuatro CSS desde `index.html`.

Criterio de salida:

- `index.html` abre en Chrome.
- Los CSS cargan correctamente.
- No hay JavaScript.

## Fase 2 — HTML semántico

- [ ] Crear radios globales para modelo:
  - `model-corolla`.
  - `model-hilux`.
- [ ] Crear radios globales para ángulo:
  - `angle-front`.
  - `angle-side`.
  - `angle-rear`.
  - `angle-right`.
- [ ] Crear radios globales para colores:
  - `color-red`.
  - `color-white`.
  - `color-black`.
  - `color-blue`.
  - `color-silver`.
  - `color-green`.
  - `color-gray`.
  - `color-orange`.
  - `color-pearl`.
- [ ] Crear `header`.
- [ ] Crear `main.app`.
- [ ] Crear `.showroom-grid`.
- [ ] Crear `aside.selector-panel`.
- [ ] Crear `section.vehicle-panel`.
- [ ] Crear `aside.quote-panel`.
- [ ] Crear `section.paint-palette`.
- [ ] Crear `footer`.
- [ ] Usar `label` para controles.
- [ ] Usar `figure` para cada display de vehículo.

Criterio de salida:

- El HTML es semántico.
- Los controles son clicables.
- Los radios están antes de `.app` para que `:checked ~ .app` funcione.

## Fase 3 — Variables CSS

- [ ] Definir `:root`.
- [ ] Definir `--car-color`.
- [ ] Definir colores de pintura.
- [ ] Definir colores del tema.
- [ ] Definir spacing.
- [ ] Definir radios.
- [ ] Definir sombras.
- [ ] Definir tamaños fluidos con `clamp()`.

Criterio de salida:

- El tema visual se controla desde `variables.css`.
- No hay valores mágicos excesivos duplicados.

## Fase 4 — Layout con CSS Grid

- [ ] Implementar `.app`.
- [ ] Implementar `.showroom-grid`.
- [ ] Usar `display: grid`.
- [ ] Usar columnas asimétricas.
- [ ] Asignar zonas con `grid-template-areas`.
- [ ] Asegurar que el área del vehículo sea la más grande.
- [ ] Asegurar que sidebar sea más angosto.
- [ ] Asegurar que cotización sea intermedia.
- [ ] Hacer que la paleta ocupe todo el ancho inferior con `grid-column: 1 / -1`.
- [ ] No usar `@media`.

Criterio de salida:

- La página tiene la estructura visual solicitada.
- La paleta está abajo ocupando todo el ancho.
- El layout funciona sin media queries.

## Fase 5 — Imágenes reales de vehículos

- [ ] Navegar en internet para buscar imágenes reales si el entorno lo permite.
- [ ] Buscar cuatro ángulos para Corolla GR.
- [ ] Buscar cuatro ángulos para Hilux 4x4 SR.
- [ ] Priorizar imágenes de calidad, sin marca de agua y con licencia adecuada.
- [ ] Guardar localmente en `assets/img/`.
- [ ] Usar nombres exactos:
  - `corolla-gr-front.jpg`
  - `corolla-gr-side.jpg`
  - `corolla-gr-rear.jpg`
  - `corolla-gr-right.jpg`
  - `hilux-4x4-front.jpg`
  - `hilux-4x4-side.jpg`
  - `hilux-4x4-rear.jpg`
  - `hilux-4x4-right.jpg`
- [ ] Si no se encuentran imágenes definitivas, crear placeholders sobrios temporales.
- [ ] Opcional: crear `docs/image-sources.md` con fuentes consultadas.

Criterio de salida:

- Las rutas de imágenes existen.
- Las imágenes se ven consistentes.
- No hay dependencias externas.
- El HTML no carga imágenes desde URLs externas.

## Fase 6 — Grid Overlay de ángulos

- [ ] Crear `.vehicle-stage`.
- [ ] Crear `.vehicle-display` para Corolla.
- [ ] Crear `.vehicle-display` para Hilux.
- [ ] Colocar cuatro imágenes por modelo en el DOM.
- [ ] Aplicar `display: grid` al contenedor.
- [ ] Aplicar `grid-area: 1 / 1` a cada imagen.
- [ ] Ocultar imágenes por defecto con `opacity: 0`.
- [ ] Activar imagen según radio de ángulo con `:checked`.
- [ ] Usar transición de `0.3s`.

Criterio de salida:

- El cambio de ángulo funciona sin JavaScript.
- Las imágenes se superponen correctamente.
- Solo una vista se ve activa por modelo.

## Fase 7 — Cambio de modelo

- [ ] Ocultar modelos por defecto.
- [ ] Mostrar Corolla cuando `#model-corolla` esté activo.
- [ ] Mostrar Hilux cuando `#model-hilux` esté activo.
- [ ] Actualizar estado visual del selector.
- [ ] Cambiar cotización visible según modelo.
- [ ] Mantener coherencia textual del modelo seleccionado.

Criterio de salida:

- Cambiar modelo actualiza vehículo y cotización.
- No se usa JS.

## Fase 8 — Cambio de color con variables CSS

- [ ] Cambiar `--car-color` con radios de color.
- [ ] Aplicar color activo a swatch seleccionado.
- [ ] Crear capa `.paint-tint` para afectar visualmente el vehículo.
- [ ] Usar transición `0.3s`.
- [ ] Mantener el tintado sobrio.
- [ ] Evitar que el color destruya la legibilidad de la imagen.

Criterio de salida:

- El color activo cambia `--car-color`.
- El vehículo reacciona visualmente.
- La UI muestra color activo.

## Fase 9 — Paleta con Flexbox

- [ ] Implementar `.palette-list`.
- [ ] Usar `display: flex`.
- [ ] Usar `justify-content: center`.
- [ ] Usar `align-items: center`.
- [ ] Usar `flex-wrap: wrap`.
- [ ] Usar `gap`.
- [ ] Cada swatch debe ser `label > input + span`.
- [ ] Mínimo seis swatches; idealmente nueve.

Criterio de salida:

- Paleta cumple Flexbox.
- Paleta es usable y responsiva sin media queries.

## Fase 10 — Animación `floatIn`

- [ ] Definir `@keyframes floatIn`.
- [ ] Aplicar animación a swatches.
- [ ] Usar `opacity`.
- [ ] Usar `transform: translateY(30px)`.
- [ ] Usar delays escalonados con `nth-child()`.

Criterio de salida:

- La paleta aparece flotando desde abajo.
- No se usa JS para animar.

## Fase 11 — Pulido visual

- [ ] Mejorar jerarquía visual.
- [ ] Hacer el vehículo más protagonista.
- [ ] Ajustar cards.
- [ ] Ajustar espaciado.
- [ ] Reducir exceso de neón.
- [ ] Mantener estilo oscuro premium.
- [ ] Mejorar estados activos.
- [ ] Mejorar foco visible.
- [ ] Revisar contraste.

Criterio de salida:

- La interfaz se ve sobria, minimalista y académica.
- No parece una maqueta genérica.
- No parece caricatura.

## Fase 12 — Validación final

Ejecutar:

```bash
grep -R "<script\|onclick\|onchange\|oninput\|addEventListener\|classList\|innerHTML\|fetch\|setTimeout\|requestAnimationFrame" -n .
```

```bash
grep -R "@media" -n .
```

```bash
find . -maxdepth 3 -type f
```

- [ ] Confirmar que no hay JS.
- [ ] Confirmar que no hay `@media`.
- [ ] Confirmar que HTML abre con doble clic.
- [ ] Confirmar que todos los controles funcionan.
- [ ] Confirmar que los CSS están separados.
- [ ] Confirmar que las imágenes cargan localmente.
- [ ] Confirmar que no hay URLs externas innecesarias.

## Fase 13 — Preparación de entrega

- [ ] Renombrar carpeta del proyecto si hace falta.
- [ ] Crear ZIP con nombre:
  - `lab03-ISW521-APELLIDO-NOMBRE.zip`
- [ ] Confirmar que el ZIP contiene la carpeta raíz.
- [ ] Probar el ZIP en una carpeta temporal.
