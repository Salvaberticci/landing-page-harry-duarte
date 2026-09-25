# Harry Duarte — Tattoo Atelier

Landing multipágina para el atelier privado de tatuajes de Harry Duarte (Valera, Estado Trujillo, Venezuela). Sitio estático con estética *neumorfismo oscuro*: fondo `#1a1c21`, acento champagne `#dfc394`, tipografías **Bodoni Moda** (display) + **Geist** (texto) y Tailwind CSS vía CDN.

El formulario de cita no usa backend: valida los datos en el cliente y abre WhatsApp con el mensaje ya redactado (`wa.me/584120537930`).

## Páginas

| Ruta | Contenido |
|---|---|
| `index.html` | Hero, estilos del atelier, obras destacadas, manifiesto, testimonios, CTA |
| `portafolio.html` | Galería con filtros (`Todos / Blackwork / Dark Realism / Ornamental / Flash`), lightbox y botón *Apartar* |
| `artistas.html` | Harry Duarte (único artista del atelier), trayectoria, filosofía y proceso |
| `cuidados.html` | Cicatrización fase por fase, señales de alarma, FAQ y protocolo |
| `agendar.html` | Solicitud de cita en 4 pasos: tipo de obra → detalles → fecha/artista → contacto y confirmación |

## Estructura

```
├── index.html
├── portafolio.html
├── artistas.html
├── cuidados.html
├── agendar.html
└── assets/
    ├── css/styles.css        # tokens, utilidades neu-*, formularios, modal, toast
    ├── js/
    │   ├── tailwind.config.js
    │   ├── main.js           # menú móvil, scrollspy, año dinámico, toast
    │   ├── portafolio.js     # filtros, lightbox, ?filtro=
    │   └── agendar.js        # pasos, validaciones, calendario, envío WhatsApp
    └── img/                  # imágenes locales (logo, hero, piezas, artistas)
```

## Ejecutar en local

Con XAMPP (o cualquier servidor estático):

```bash
# Apache apuntando a htdocs/.../harry-duarte
http://localhost/webs-negocios/harry-duarte/index.html
```

También funciona con `npx serve .` o `python -m http.server 8000`.

## Personalizar

- **Número de WhatsApp:** `assets/js/agendar.js` → `var WHATSAPP_NUMBER = "584120537930";`
- **Anticipo, horario y días cerrados:** `assets/js/agendar.js` (calendario y mensaje final)
- **Piezas del portafolio:** editar las tarjetas `.gallery-card` en `portafolio.html`
- **Imágenes:** reemplazar los archivos en `assets/img/`

## Despliegue

Static site sin build. En Vercel:

```bash
vercel --prod
```

Framework: *Other* · Output directory: `.` · Build command: *(vacío)*.

## Stack

- HTML5 + Tailwind CSS (CDN) + `tailwind.config.js` propio
- JavaScript vanilla (sin dependencias, sin framework)
- Google Fonts: Bodoni Moda, Geist y Material Symbols
