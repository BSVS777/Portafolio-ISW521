# acceptance-checklist.md — Criterios de aceptación

## 1. Estructura del proyecto

- [ ] Existe `index.html`.
- [ ] Existe `css/variables.css`.
- [ ] Existe `css/layout.css`.
- [ ] Existe `css/palette.css`.
- [ ] Existe `css/interactions.css`.
- [ ] Existe `assets/img/`.
- [ ] Las imágenes están guardadas localmente.
- [ ] No hay dependencias externas obligatorias.
- [ ] No existe `package.json`.

## 2. Restricciones absolutas

- [ ] No existe JavaScript.
- [ ] No existen archivos `.js`.
- [ ] No existe etiqueta `<script>`.
- [ ] No existen atributos `onclick`.
- [ ] No existen atributos `onchange`.
- [ ] No existen atributos `oninput`.
- [ ] No existe `addEventListener`.
- [ ] No existe `classList`.
- [ ] No existe `innerHTML`.
- [ ] No existe `fetch`.
- [ ] No existe `setTimeout`.
- [ ] No existe `requestAnimationFrame`.
- [ ] No existen frameworks.
- [ ] No existen librerías externas.
- [ ] No existe Bootstrap.
- [ ] No existe Tailwind.
- [ ] No existe React.
- [ ] No existe Vue.
- [ ] No existe `@media`.

## 3. HTML semántico

- [ ] Usa `header`.
- [ ] Usa `main`.
- [ ] Usa `section`.
- [ ] Usa `aside`.
- [ ] Usa `figure`.
- [ ] Usa `footer`.
- [ ] Usa `label`.
- [ ] Usa `input type="radio"`.
- [ ] Los radios son accesibles.
- [ ] Los labels son clicables.
- [ ] Las imágenes tienen `alt` descriptivo.

## 4. CSS Grid principal

- [ ] `.showroom-grid` usa `display: grid`.
- [ ] El layout tiene zonas diferenciadas.
- [ ] El sidebar izquierdo es más angosto.
- [ ] El área central del vehículo es la más grande.
- [ ] El panel de cotización es intermedio.
- [ ] La paleta inferior ocupa todo el ancho.
- [ ] Se usa `grid-column: 1 / -1` o equivalente para la paleta.
- [ ] La estructura se parece al layout esperado del laboratorio.

## 5. Grid Overlay de ángulos

- [ ] Cada modelo tiene sus vistas presentes en el DOM.
- [ ] Corolla tiene frente, perfil, atrás y lado derecho.
- [ ] Hilux tiene frente, perfil, atrás y lado derecho.
- [ ] `.vehicle-display` usa `display: grid`.
- [ ] Cada `.vehicle-angle` usa `grid-area: 1 / 1`.
- [ ] Las imágenes inactivas usan `opacity: 0`.
- [ ] La imagen activa usa `opacity: 1`.
- [ ] El cambio de ángulo usa `transition: 0.3s`.
- [ ] No se usa JavaScript para cambiar ángulo.

## 6. Radio Button Hack

- [ ] El modelo cambia con `input[type="radio"]:checked`.
- [ ] El ángulo cambia con `input[type="radio"]:checked`.
- [ ] El color cambia con `input[type="radio"]:checked`.
- [ ] La cotización cambia con `input[type="radio"]:checked`.
- [ ] Los controles activos tienen estilo visible.
- [ ] Los radios están ubicados de forma que los selectores `~` funcionen.

## 7. Variables CSS

- [ ] Existe `--car-color`.
- [ ] Existen variables para cada color de pintura.
- [ ] Existen variables de tema.
- [ ] `--car-color` cambia según el color seleccionado.
- [ ] El vehículo reacciona visualmente al color seleccionado.
- [ ] La transición del color es suave.

## 8. Paleta Flexbox

- [ ] La paleta usa `display: flex`.
- [ ] Usa `justify-content: center`.
- [ ] Usa `align-items: center`.
- [ ] Usa `flex-wrap: wrap`.
- [ ] Usa `gap`.
- [ ] Tiene mínimo seis colores.
- [ ] Cada swatch es un `label` con un radio adentro.
- [ ] El color activo se ve claramente.

## 9. Animación obligatoria

- [ ] Existe `@keyframes floatIn`.
- [ ] La animación usa `opacity`.
- [ ] La animación usa `transform: translateY(30px)`.
- [ ] Los swatches tienen animación.
- [ ] Hay delays escalonados.
- [ ] No se usa JavaScript para animar.

## 10. Imágenes reales

- [ ] Las imágenes de Corolla están en `assets/img/`.
- [ ] Las imágenes de Hilux están en `assets/img/`.
- [ ] Los nombres de archivo coinciden con lo definido.
- [ ] Las imágenes no se cargan desde URLs externas.
- [ ] Las imágenes no se deforman.
- [ ] Se usa `object-fit: contain`.
- [ ] Si se buscaron imágenes en internet, las fuentes quedan documentadas.
- [ ] No hay marcas de agua visibles.
- [ ] Si faltan imágenes reales, hay placeholders sobrios y queda pendiente documentado.

## 11. Cotización

- [ ] Hay cotización para Corolla.
- [ ] Hay cotización para Hilux.
- [ ] El resumen cambia según modelo.
- [ ] Los montos son visibles y legibles.
- [ ] El botón de generar cotización es visual, no requiere JS.
- [ ] La ficha se ve sobria y profesional.

## 12. Estética

- [ ] Diseño oscuro.
- [ ] Diseño minimalista.
- [ ] Diseño sobrio.
- [ ] Diseño técnico.
- [ ] Diseño defendible académicamente.
- [ ] Vehículo protagonista.
- [ ] Paleta limpia.
- [ ] Cotización clara.
- [ ] No hay exceso de glow.
- [ ] No parece dashboard genérico.
- [ ] No parece maqueta caricaturesca.

## 13. Validaciones por comando

Ejecutar:

```bash
grep -R "<script\|onclick\|onchange\|oninput\|addEventListener\|classList\|innerHTML\|fetch\|setTimeout\|requestAnimationFrame" -n .
```

Debe devolver vacío o solo falsos positivos dentro de documentación.

Ejecutar:

```bash
grep -R "@media" -n .
```

Debe devolver vacío o solo menciones dentro de documentación, no CSS productivo.

Ejecutar:

```bash
find . -maxdepth 3 -type f
```

Debe mostrar la estructura esperada.

## 14. Entrega

- [ ] El proyecto abre con doble clic en `index.html`.
- [ ] El ZIP tiene el nombre `lab03-ISW521-APELLIDO-NOMBRE.zip`.
- [ ] El ZIP contiene la carpeta raíz del proyecto.
- [ ] El proyecto fue probado después de comprimir.
