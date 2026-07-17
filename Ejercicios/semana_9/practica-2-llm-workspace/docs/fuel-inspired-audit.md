# Auditoria Fuel-inspired

Fecha: 2026-07-16  
Proyecto: Practica 2 - Memoria de Contexto LLM  
Referencia inspeccionada: `https://fuel.framer.website/` y marketplace de Framer.

## Evidencia de inspeccion

Se inspecciono la demo publica con Playwright en:

- Desktop: 1440 x 1000, evidencia `evidencias/fuel-desktop.png`.
- Tablet: 768 x 1000, evidencia `evidencias/fuel-tablet.png`.
- Mobile: 390 x 900, evidencia `evidencias/fuel-mobile.png`.

Tambien se reviso el DOM publico de la demo y del marketplace. La demo expone una experiencia de agencia/portafolio con navegacion numerada `Home 01`, `Portfolio 02`, `About 03`, `Contact 04`; secciones de About, Portfolio, Premium Services, Pricing, Testimonial, Archive, Stats, Article, FAQ y Footer.

## Lectura de la referencia

### Jerarquia de secciones

1. Hero editorial con navegacion numerada, imagen protagonista, claim grande, metadatos y CTA.
2. About con rotulos `(01)`, texto grande repetido tipo manifiesto y visual lateral.
3. Bloque `Pre / Post / Results` con estadisticas y composicion asimetrica.
4. Galeria/carrusel de imagenes.
5. Portfolio con lista numerada y metadatos.
6. Servicios premium en bloques verticales con imagen, numero grande y texto.
7. Pricing en columnas.
8. Testimonial con imagenes, texto destacado y cifras.
9. Archive con filas compactas e imagenes contextuales.
10. CTA visual con imagen de fondo.
11. Stats en grilla editorial.
12. Article/listado editorial.
13. FAQ con showreel.
14. Footer con CTA, navegacion numerada y gran presencia tipografica.

### Sistema de columnas y espaciado

- Desktop: grilla amplia, composicion editorial asimetrica, uso fuerte de margenes laterales y bloques con offsets.
- Tablet: se reduce la navegacion visible; la experiencia mantiene apilamiento editorial y menos capas simultaneas.
- Mobile: navegacion principal se simplifica, predominan secciones verticales y previews visibles.
- Espaciado: grandes areas de aire, divisores finos, secciones largas y respiracion vertical cinematografica.

### Tipografia

- Titulares display de gran escala, line-height ajustado y peso alto.
- Metadatos pequenos en mayusculas o formato de etiqueta.
- Numeracion editorial visible: `(01)`, `01`, `FX-25'`, `© 2025`.
- Contraste entre masas tipograficas enormes y texto funcional compacto.

### Paleta

- Base clara/neutra en la referencia, con alto contraste y fotografias de acento.
- Uso puntual de color mediante imagenes y detalles.
- Para este proyecto se reinterpretara con identidad propia: fondo editorial claro-calido controlado, tinta oscura, bordes finos y acento tecnico verdoso/ambar, evitando el azul/purpura SaaS actual.

### Navegacion

- Numerada y minimalista.
- Links con texto en dos lineas o agrupado con numero.
- En desktop se ve como parte del grid superior.
- En tablet/mobile los links principales no aparecen igual; se prioriza una entrada mas compacta.

### Estados hover e interacciones

- Links de portfolio y servicios sugieren previews y movimiento.
- CTAs compactos, con presencia pero sin parecer botones SaaS.
- Imagenes y filas funcionan como superficies interactivas.
- La UI no depende solo de iconos; usa texto, numero y metadatos.

### Animaciones, scroll y motion

- Entrada escalonada de bloques.
- Reveals de imagenes con mascara/clip.
- Scroll narrativo por secciones.
- Carruseles/tickers horizontales.
- Elementos sticky en secciones largas.
- Movimiento organico sobre estructura suiza.
- Se debe respetar `prefers-reduced-motion` y evitar scroll hijacking.

### Elementos detectados

- Sticky: imagenes y metadatos laterales en secciones de servicios/archive.
- Parallax: sutil en imagenes y capas visuales.
- Mascaras/reveals: imagenes y texto aparecen mediante recorte.
- Tickers/marquees: texto repetido y listas horizontales.
- Carruseles: tira de imagenes con controles.
- Modales: no son el foco de la referencia, pero el proyecto necesita modal de sesion expirada.
- Transiciones de pagina: la referencia se siente continua; en este proyecto se implementaran transiciones entre secciones sin cambiar rutas.
- Cursor: se reinterpretara solo en desktop con puntero preciso y labels contextuales.

## Auditoria del proyecto actual

### Framework y runtime

- Aplicacion estatica sin framework.
- `index.html` carga `assets/styles.css` y luego `src/bootstrap.js` via `import()`.
- Tests con `node --test`.
- Servidor local: `python -m http.server 5500`.

### Rutas

- Una sola ruta estatica: `index.html`.
- No hay router ni vistas multipagina.

### Componentes y UI

- UI actual concentrada en `index.html` y `src/adapters/ui/DomWorkspaceView.js`.
- Panel de favoritos, conversacion, estado de storage, modal, toasts y composer.
- Estetica actual: dashboard oscuro con gradientes, cards redondeadas y ambient blobs.
- Riesgo visual: parece SaaS generico, no editorial.

### CSS

- Un unico archivo grande: `assets/styles.css`.
- Variables actuales no coinciden con los tokens solicitados.
- Mucho uso de gradientes, sombras, blur y radios grandes.
- Responsive basico en 860px y 620px.

### Assets

- No hay libreria de imagenes del proyecto.
- Existe carpeta `evidencias/`.
- Se deben crear visuales propios con CSS/HTML o assets ligeros locales; no se reutilizaran imagenes de Fuel.

### Datos y funcionalidad

- `sessionStorage`: clave `conversacion`, historial con objetos `{ rol, contenido }`.
- `localStorage`: clave `favoritos`.
- Cookie: `llm_token`, valor `tk_<epochMsExpiracion>`, TTL 120 segundos.
- `ApiLLM` esta embebida y congelada en `index.html`; no debe modificarse.
- `ApiLlmGateway` convierte el historial a DTO exacto antes de llamar a `ApiLLM.enviar`.
- `ChatService` limpia solo la conversacion ante 401.
- Favoritos sobreviven al 401.
- 422 se transforma en mensaje de error de formato.

### Arquitectura

- Ya existe separacion hexagonal parcial:
  - `domain/`
  - `application/`
  - `application/ports/`
  - `adapters/api`
  - `adapters/auth`
  - `adapters/storage`
  - `adapters/ui`
  - `controllers`
- La estructura objetivo del prompt es mas granular, pero para mantener alcance UI se conservara la arquitectura funcional actual y se agregaran adaptadores/presentacion sin migracion disruptiva.

### Accesibilidad actual

- Tiene `aria-live`, modal con `role=dialog`, labels ocultos y focus visible.
- Faltan: skip link, focus trap completo en modal/menu, Escape para cerrar, restauracion de foco robusta, acordeones FAQ con `aria-expanded`, menu movil accesible, estados no dependientes de hover.

## Elementos de Fuel a reinterpretar

- Navegacion numerada editorial adaptada a: `Home 01`, `Workspace 02`, `Favoritos 03`, `Arquitectura 04`, `Inspector 05`.
- Hero cinematografico con titular multilinea, metadatos, CTA y visual tecnico propio.
- Secciones con rotulos `(01)`, metadata, divisores finos y grandes masas tipograficas.
- Scroll narrativo con reveals por texto e imagen.
- Ticker horizontal educativo sobre `sessionStorage`, `localStorage`, cookies y puertos.
- Bloques verticales interactivos para funcionalidades y arquitectura.
- Archivo/historial compacto basado en mensajes/favoritos/eventos de storage.
- FAQ accesible sobre 401, 422, cookies, storage, puertos y adaptadores.
- Footer tipografico de gran escala.

## Elementos que no se copiaran

- Marca Fuel, nombres de proyectos, textos, imagenes, logos, email y activos.
- Secciones comerciales de pricing/testimonials como tales.
- Imagenes de personas/productos de la demo.
- Copy de agencia creativa.
- Navegacion exacta y composiciones pixel-perfect.
- Efectos que comprometan accesibilidad o rendimiento.

## Partes que se conservaran

- Contrato congelado de `ApiLLM` en `index.html`.
- `ApiLlmGateway` y su DTO `{ rol, contenido }`.
- Claves `conversacion`, `favoritos` y `llm_token`.
- TTL real de 120 segundos.
- Servicios de aplicacion para chat, favoritos y sesion.
- Repositorios de storage y adaptador de cookie.
- Tests existentes, ampliandolos solo si el cambio lo requiere.

## Partes que se refactorizaran

- Estructura HTML de `index.html` para pasar de dashboard a experiencia editorial.
- `DomWorkspaceView.js` para soportar:
  - acciones por mensaje,
  - inspector de storage,
  - menu movil,
  - FAQ,
  - modal con focus/escape,
  - estados visuales mas completos.
- `assets/styles.css` sera reemplazado por un sistema visual con tokens solicitados.
- Se agregara un adaptador/motor de motion ligero si hace falta, priorizando CSS, IntersectionObserver y Web APIs.
- README y documentacion de diseno/motion/accesibilidad.

## Riesgos tecnicos

- El alcance visual es amplio para una app estatica; se debe evitar crear archivos gigantes inmantenibles.
- El contrato de `ApiLLM` vive dentro de `index.html`; hay que redisenar alrededor sin tocar el bloque congelado.
- Las animaciones de scroll pueden afectar rendimiento en equipos modestos si se abusa de listeners.
- Menu, modal e inspector requieren foco y limpieza de listeners para no degradar accesibilidad.
- Capturas/Lighthouse pueden estar limitados por el entorno local y sandbox.
- Sin dependencias instaladas, cualquier carrusel/drag debe implementarse con Pointer Events o scroll nativo.

## Plan de implementacion por fases

### Fase 1 - Auditoria

- Completar este documento.
- Mantener evidencia de referencia en `evidencias/fuel-*.png`.

### Fase 2 - Sistema visual

- Definir tokens CSS requeridos.
- Crear grilla editorial fluida, tipografia clamp, escala de espacios y estados focus.
- Eliminar blobs/gradientes SaaS.

### Fase 3 - Estructura editorial

- Rehacer `index.html` con hero, intro, contexto, workspace, favoritos, arquitectura, stats, archivo, FAQ, CTA y footer.
- Mantener IDs que necesita la UI o actualizar `DomWorkspaceView` de forma controlada.

### Fase 4 - Integracion funcional

- Reconectar chat, favoritos, token, modal y toasts.
- Agregar Storage Inspector sin acceso directo desde componentes visuales fuera del adaptador UI.
- Preservar `sessionStorage`, `localStorage`, cookie y manejo 401/422.

### Fase 5 - Motion

- Preloader con contador 0-100 y version abreviada por `sessionStorage`.
- Reveals con IntersectionObserver.
- Cursor contextual en desktop.
- Marquee pausado en hover, CTA magnetico y microinteracciones.

### Fase 6 - Responsive y accesibilidad

- Menu fullscreen movil con Escape/cierre/focus restore.
- Modal con focus trap.
- FAQ con teclado y `aria-expanded`.
- Verificar 320, 768, 1024, 1440 y reduced motion.

### Fase 7 - Calidad

- Ejecutar `npm test`.
- Levantar app local y verificar con Playwright.
- Capturar evidencia responsive.
- Actualizar docs finales.
- Revisar consola y corregir errores.

