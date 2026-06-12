# asset-sourcing.md — Búsqueda y uso de imágenes

## 1. Objetivo

Buscar, seleccionar y preparar imágenes reales para el showroom interactivo del laboratorio.

Se requieren imágenes locales para dos modelos Toyota, cada uno con cuatro ángulos:

- Frente.
- Perfil lateral.
- Parte trasera.
- Lado derecho / otro lado.

## 2. Permiso para navegar

El agente de implementación puede navegar en internet para buscar imágenes reales de referencia o imágenes utilizables.

La navegación debe limitarse a encontrar imágenes adecuadas para el proyecto y documentar su origen.

No se deben agregar dependencias externas ni cargar imágenes desde URLs remotas en el HTML final.

## 3. Modelos buscados

### Toyota Corolla GR 2024

Archivos finales:

```txt
assets/img/corolla-gr-front.jpg
assets/img/corolla-gr-side.jpg
assets/img/corolla-gr-rear.jpg
assets/img/corolla-gr-right.jpg
```

Consultas sugeridas:

```txt
Toyota Corolla GR 2024 front view
Toyota Corolla GR 2024 side view
Toyota Corolla GR 2024 rear view
Toyota Corolla GR 2024 right side view
Toyota Corolla GR transparent png side
Toyota Corolla GR press image front
```

### Toyota Hilux 4x4 SR 2024

Archivos finales:

```txt
assets/img/hilux-4x4-front.jpg
assets/img/hilux-4x4-side.jpg
assets/img/hilux-4x4-rear.jpg
assets/img/hilux-4x4-right.jpg
```

Consultas sugeridas:

```txt
Toyota Hilux 4x4 SR 2024 front view
Toyota Hilux 4x4 SR 2024 side view
Toyota Hilux 4x4 SR 2024 rear view
Toyota Hilux 4x4 SR 2024 right side view
Toyota Hilux transparent png side
Toyota Hilux press image rear
```

## 4. Criterios de selección

Priorizar imágenes que cumplan:

- Buena resolución.
- Sin marcas de agua.
- Vehículo completo visible.
- Fondo transparente, blanco o uniforme.
- Ángulo claro.
- Proporción similar entre todas las imágenes.
- Modelo visualmente parecido al solicitado.
- Licencia clara o fuente oficial.

Evitar:

- Imágenes con personas.
- Imágenes con fondos muy saturados.
- Fotografías nocturnas.
- Imágenes demasiado pequeñas.
- Imágenes deformadas.
- Imágenes con watermark.
- Imágenes de modelos muy distintos.
- Hotlinking directo a URLs externas.

## 5. Fuentes recomendadas

Orden recomendado:

1. Sitios oficiales de Toyota o press kits.
2. Wikimedia Commons.
3. Bancos de imágenes con licencia libre.
4. Catálogos o referencias visuales solo si se documentan y se usan para crear placeholders propios.

## 6. Procesamiento permitido

Se permite:

- Recortar márgenes innecesarios.
- Convertir a `.jpg`.
- Ajustar tamaño.
- Optimizar peso.
- Uniformar proporciones.
- Quitar fondo solo si se hace localmente y no requiere dependencia final.
- Usar placeholders CSS o imágenes propias si no se consigue material usable.

No se permite:

- Dejar scripts de procesamiento en la entrega.
- Dejar herramientas externas como dependencia.
- Cargar imágenes desde internet en el HTML final.
- Usar imágenes con licencia dudosa sin documentarlo.

## 7. Documentación de fuentes

Si se descargan imágenes, crear opcionalmente:

```txt
docs/image-sources.md
```

Formato sugerido:

```md
# image-sources.md

## Toyota Corolla GR

| Archivo local | Fuente | URL | Licencia/nota |
|---|---|---|---|
| corolla-gr-front.jpg | Fuente | URL | Nota |

## Toyota Hilux 4x4 SR

| Archivo local | Fuente | URL | Licencia/nota |
|---|---|---|---|
| hilux-4x4-front.jpg | Fuente | URL | Nota |
```

## 8. Fallback si no se encuentran imágenes

Si no se consiguen imágenes adecuadas:

- Crear placeholders sobrios.
- Usar siluetas minimalistas.
- Mantener nombres de archivo exactos.
- Documentar que son temporales.
- No romper el Grid Overlay.
- No retrasar la implementación técnica por búsqueda excesiva de assets.

Prioridad del laboratorio:

1. Cumplimiento técnico CSS.
2. Interactividad sin JavaScript.
3. Estructura correcta.
4. Visual sobrio.
5. Imágenes reales.
