# Plan: Restaurar imágenes y videos reales de tatuajes

## Problema
En el commit `4e90883` se eliminaron las **imágenes JPG reales de tatuajes** (obra-leon.jpg, obra-retrato.jpg, obra-aguilas.jpg, obra-aguila.jpg, obra-shishi.jpg, pieza-corona.jpg, pieza-lettering.jpg, flash-daga.jpg, flash-cuervo.jpg, flash-oculo.jpg, flash-polilla.jpg, estudio.jpg) y se reemplazaron con **SVG placeholders** creados artificialmente. Los videos también se renombraron pero no se usaron correctamente en las secciones correspondientes.

## Objetivo
1. Restaurar las 12 imágenes JPG reales de tatuajes desde el commit `0c28bb5`
2. Usar los videos reales en las secciones apropiadas:
   - Hero video (hero-video.mp4) → index.html hero section
   - Atelier process (atelier-process.mp4) → index.html "Detrás de la Agenda"
   - Tattoo session (tattoo-session.mp4) → index.html "Detrás de la Agenda"
   - Artist portrait (artist-portrait.mp4) → artistas.html "En la cabina"
   - Artwork detail (artwork-detail.mp4) → artistas.html "En la cabina"
   - Studio atmosphere (studio-atmosphere.mov) → agendar.html paso 3
3. Actualizar HTMLs para referenciar archivos correctos (JPG para imágenes, MP4/MOV para videos)
4. Adaptar textos/alts según el contenido real de cada asset
5. Commit y push a GitHub

## Archivos a restaurar (desde commit 0c28bb5)
- assets/img/obra-leon.jpg
- assets/img/obra-retrato.jpg
- assets/img/obra-aguilas.jpg
- assets/img/obra-aguila.jpg
- assets/img/obra-shishi.jpg
- assets/img/pieza-corona.jpg
- assets/img/pieza-lettering.jpg
- assets/img/flash-daga.jpg
- assets/img/flash-cuervo.jpg
- assets/img/flash-oculo.jpg
- assets/img/flash-polilla.jpg
- assets/img/estudio.jpg

## Videos ya disponibles (commit 4e90883 / actual)
- assets/img/hero-video.mp4 (original: VIDEO-2025-12-18-22-51-44.mp4)
- assets/img/atelier-process.mp4 (original: 1783779050836173.mp4)
- assets/img/tattoo-session.mp4 (original: 1790812298344796.mp4)
- assets/img/artist-portrait.mp4 (original: IMG_0125.MOV, comprimido)
- assets/img/artwork-detail.mp4 (original: IMG_0054.MOV, comprimido)
- assets/img/studio-atmosphere.mov (original: IMG_8797.MOV)

## HTMLs a actualizar

### index.html
- Hero section: cambiar `<img src="assets/img/hero-harry.png">` → `<video src="assets/img/hero-video.mp4">`
- Obras destacadas (5 imágenes): cambiar `.svg` → `.jpg` con alts correctos
- Sección "Detrás de la Agenda": usar atelier-process.mp4 y tattoo-session.mp4

### portafolio.html
- 6 tarjetas de galería: cambiar `data-src` y `src` de `.svg` → `.jpg`
- Actualizar textos/alts según cada pieza real

### artistas.html
- Hero: cambiar `<img src="assets/img/hero-harry.png">` → `<video src="assets/img/hero-video.mp4">`
- Sección "En la cabina": usar artist-portrait.mp4 y artwork-detail.mp4

### agendar.html
- Paso 3: usar studio-atmosphere.mov en lugar de hero-video.mp4
- Imagen estudio: cambiar estudio.svg → estudio.jpg

## Pasos de implementación

1. **Restaurar imágenes JPG** desde commit 0c28bb5 usando `git show 0c28bb5:assets/img/archivo.jpg > assets/img/archivo.jpg`
2. **Eliminar SVGs placeholders** creados artificialmente
3. **Actualizar index.html** - hero video, obras destacadas, sección videos
4. **Actualizar portafolio.html** - 6 piezas galería con imágenes reales
5. **Actualizar artistas.html** - hero video, sección "En la cabina"
6. **Actualizar agendar.html** - paso 3 video, imagen estudio
7. **Verificar** que todos los alts y textos correspondan al contenido real
8. **Commit y push** a GitHub

## Validación
- Abrir index.html, portafolio.html, artistas.html, agendar.html en navegador
- Verificar que se carguen imágenes JPG reales (no SVGs)
- Verificar que videos se reproduzcan correctamente
- Verificar que lightbox en portafolio funcione con imágenes reales
- Verificar textos/alts descriptivos y precisos