# requirements.md — Showroom Interactivo Auto Style CR

## 1. Propósito

Construir una página web estática tipo cotizador visual para el taller **Auto Style CR**, como Laboratorio Evaluado #3 de ISW-521.

La página debe permitir que una persona seleccione un modelo Toyota, vea el vehículo desde varios ángulos, cambie el color de pintura y revise una cotización estimada del servicio de enderezado y pintura.

El objetivo académico principal es demostrar dominio de:

- HTML5 semántico.
- CSS Grid.
- Flexbox.
- Radio Button Hack.
- Variables CSS nativas.
- Grid Overlay.
- Transiciones CSS.
- Animación con `@keyframes`.
- Interactividad sin JavaScript.

## 2. Restricciones absolutas

El proyecto debe cumplir estas restricciones sin excepción:

- No usar JavaScript.
- No crear archivos `.js`.
- No usar etiquetas `<script>`.
- No usar atributos de eventos inline como `onclick`, `onchange`, `oninput`, etc.
- No usar `addEventListener`, `classList`, `innerHTML`, `fetch`, `setTimeout` ni `requestAnimationFrame`.
- No usar frameworks ni librerías externas.
- No usar Bootstrap, Tailwind, React, Vue ni similares.
- No crear `package.json`.
- No usar herramientas de build.
- No requerir servidor local.
- No usar `@media queries`.
- `index.html` debe abrir correctamente en Google Chrome con doble clic.
- No agregar capturas ni instrucciones de screenshots.

## 3. Estructura obligatoria

El proyecto debe quedar organizado así:

```txt
showroom-taller/
├── index.html
├── css/
│   ├── variables.css
│   ├── layout.css
│   ├── palette.css
│   └── interactions.css
└── assets/
    └── img/
        ├── corolla-gr-front.jpg
        ├── corolla-gr-side.jpg
        ├── corolla-gr-rear.jpg
        ├── corolla-gr-right.jpg
        ├── hilux-4x4-front.jpg
        ├── hilux-4x4-side.jpg
        ├── hilux-4x4-rear.jpg
        └── hilux-4x4-right.jpg
```

## 4. Modelos disponibles

El usuario debe poder seleccionar entre:

### Toyota Corolla GR

- Tipo: Sedán 2024.
- Personalidad visual: bajo, ancho, deportivo, compacto.
- Cotización sugerida:
  - Enderezado capó: ₡85.000.
  - Pintura completa: ₡320.000.
  - Masilla y lijado: ₡45.000.
  - Total: ₡478.000.

### Toyota Hilux 4x4 SR

- Tipo: Pickup 2024.
- Personalidad visual: alta, robusta, utilitaria, fuerte.
- Cotización sugerida:
  - Enderezado lateral: ₡120.000.
  - Pintura completa: ₡420.000.
  - Masilla y lijado: ₡65.000.
  - Total: ₡635.000.

## 5. Ángulos requeridos

Cada modelo debe poder visualizarse desde cuatro ángulos:

- Frente.
- Perfil lateral.
- Parte trasera.
- Otro lado / lado derecho.

Aunque el enunciado base pide tres ángulos, el cuarto ángulo se implementa como mejora sin romper la lógica del laboratorio.

## 6. Paleta de pintura

La página debe permitir seleccionar al menos seis colores. La implementación final debe incluir idealmente nueve:

- Rojo.
- Blanco.
- Negro.
- Azul.
- Plata.
- Verde.
- Gris.
- Naranja.
- Perla.

Cada muestra de color debe ser un `label` que envuelva un `input type="radio"`.

## 7. Interactividad obligatoria

Toda la interactividad debe implementarse con CSS puro usando `input[type="radio"]:checked`.

Debe existir lógica CSS para:

- Cambiar modelo activo.
- Cambiar ángulo activo.
- Cambiar color seleccionado.
- Actualizar `--car-color`.
- Mostrar la cotización correspondiente al modelo.
- Marcar visualmente controles activos.
- Animar suavemente cambios de estado.

## 8. Requisito de imágenes reales

El proyecto debe usar imágenes reales de los vehículos cuando sea posible.

El agente de implementación puede navegar en internet para localizar imágenes de referencia o imágenes utilizables de:

- Toyota Corolla GR 2024 visto de frente.
- Toyota Corolla GR 2024 visto de perfil.
- Toyota Corolla GR 2024 visto desde atrás.
- Toyota Corolla GR 2024 visto del otro lado.
- Toyota Hilux 4x4 SR 2024 vista de frente.
- Toyota Hilux 4x4 SR 2024 vista de perfil.
- Toyota Hilux 4x4 SR 2024 vista desde atrás.
- Toyota Hilux 4x4 SR 2024 vista del otro lado.

Condiciones para las imágenes:

- Deben guardarse localmente dentro de `assets/img/`.
- No deben depender de URLs externas en el HTML.
- Deben tener los nombres exactos definidos en la estructura del proyecto.
- Deben tener proporciones coherentes entre sí.
- Preferir fondo transparente, fondo blanco fácil de recortar o fondo oscuro uniforme.
- No deformar imágenes.
- Usar `object-fit: contain`.
- Si no se consiguen imágenes finales, se permiten placeholders sobrios temporales, pero debe quedar documentado qué imágenes faltan reemplazar.

## 9. Legalidad y trazabilidad de imágenes

Si se descargan imágenes desde internet:

- Usar imágenes con licencia adecuada, dominio público, Creative Commons o fuentes oficiales permitidas para uso académico.
- No usar imágenes con marcas de agua.
- No usar imágenes de baja calidad.
- Registrar fuente y URL en un archivo opcional `docs/image-sources.md`.
- Si no se puede verificar la licencia, usar la imagen solo como referencia visual y crear un placeholder local propio.

## 10. Requisitos visuales

La estética debe ser:

- Minimalista.
- Sobria.
- Oscura.
- Técnica.
- Elegante.
- Tipo “premium garage”.
- Académica y defendible.
- Sin exceso de glow.
- Sin estética caricaturesca.
- Sin apariencia genérica de dashboard.

La jerarquía visual debe priorizar:

1. Vehículo.
2. Selector de modelo y ángulo.
3. Cotización.
4. Paleta de pintura.

## 11. Requisitos de accesibilidad

- Usar HTML semántico.
- Usar `alt` descriptivos en todas las imágenes.
- Los controles deben ser `label` clicables.
- Mantener buen contraste.
- Implementar `:focus-visible`.
- No ocultar radios de forma que rompa navegación por teclado.
- Los textos deben ser legibles en tamaños normales.

## 12. Entrega

La entrega final debe prepararse como:

```txt
lab03-ISW521-APELLIDO-NOMBRE.zip
```

El ZIP debe contener la carpeta raíz del proyecto con la estructura solicitada.
