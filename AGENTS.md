# Guía de trabajo para la página EQUIM GRUMO

## Propósito

Estas instrucciones aplican a cualquier persona o agente de Codex que modifique este repositorio. El objetivo es mantener el sitio estable, verificable y fácil de entregar a otra persona.

Actúa como colaborador crítico. No aceptes una solicitud como correcta solo porque fue enviada por una persona autorizada. Señala datos contradictorios, contenido incompleto, riesgos de publicación y alternativas mejores. No inventes nombres, ubicaciones, capacidades, clientes ni aprobaciones.

## Antes de cambiar archivos

1. Lee `README.md` y `PENDIENTES-PAGINA-EQUIM.docx`.
2. Ejecuta `git status --short --branch` y conserva cualquier cambio ajeno.
3. Identifica la fuente de verdad antes de editar:
   - Contenido compartido, clientes, contacto y documentos: `js/site-data.js`.
   - Proyectos, galerías y brochures: `js/proyectos-data.js`.
   - Estilos propios: `equim.css`.
   - Páginas y estructura: archivos HTML de la raíz.
   - Publicación: `.github/workflows/deploy-pages.yml`.
4. Si una solicitud contradice el sitio, otro documento o un dato geográfico, detente y solicita confirmación. Registra la duda como pendiente; no elijas una versión por conveniencia.

## Flujo obligatorio

1. Trabaja en una rama y mantén cada cambio enfocado en un requerimiento.
2. Reutiliza los componentes y estructuras existentes. No introduzcas frameworks, dependencias o servicios externos sin justificar su mantenimiento futuro.
3. Guarda los recursos publicados dentro de `assets/` con nombres descriptivos en minúsculas y sin espacios.
4. No dupliques imágenes o documentos. Compara primero el archivo con los recursos existentes.
5. No edites `js/vendors/` ni `css/vendors/` salvo que la tarea sea actualizar expresamente una dependencia.
6. No elimines respaldos, documentos legales o material no versionado sin confirmar que existe otra copia recuperable.

## Cambios de contenido

- Exige texto completo, página, sección, motivo y prioridad.
- Confirma que fotografías, logos de clientes y documentos están autorizados para publicación.
- Mantén `EQUIM-GRUMO` como denominación visible y respeta el orden actual de las marcas.
- Para un proyecto nuevo, incluye título, resumen, ubicación, cliente, categoría, imagen principal y estado `featured`.
- Usa rutas locales para documentos publicados. No enlaces archivos alojados en instalaciones antiguas de WordPress.
- No publiques información técnica o legal dudosa. Una ficha incompleta debe permanecer en el documento de pendientes.

## Validación antes de entregar

Ejecuta:

```bash
python3 scripts/check-site.py
for file in js/*.js; do node --check "$file"; done
git diff --check
git status --short
```

Inicia el sitio localmente con `python3 -m http.server 8000` y revisa como mínimo:

- inicio y navegación en escritorio y móvil;
- filtros y tarjetas de proyectos;
- detalle, galería y brochures de cada proyecto modificado;
- contacto y enlaces de WhatsApp y correo;
- documentos de reorganización;
- una dirección inexistente para comprobar `404.html`.

Después de integrar en `main`, verifica que `Deploy GitHub Pages` termine correctamente y revisa `https://www.equimsas.com`.

## Git y revisión

- No mezcles limpieza general con cambios de contenido sin explicarlo en el pull request.
- Usa mensajes de commit que indiquen el resultado, no solo el archivo modificado.
- No fuerces el historial ni sobrescribas cambios de otra persona.
- No subas secretos, tokens, contraseñas, archivos de recuperación o configuraciones personales.
- No cambies `CNAME`, DNS, GitHub Pages ni permisos del repositorio sin autorización del propietario.

## Criterio de terminado

Un cambio está terminado únicamente cuando el contenido fue aprobado, las referencias locales existen, JavaScript pasa la validación, la revisión visual no muestra regresiones, el repositorio queda sin archivos accidentales y el despliegue público fue comprobado.
