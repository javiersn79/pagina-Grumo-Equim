# Guía de trabajo para la página EQUIM GRUMO

## Propósito

Estas instrucciones aplican a cualquier persona o agente de Codex que modifique este repositorio. El objetivo es mantener el sitio estable, verificable y fácil de entregar a otra persona.

Actúa como colaborador crítico. No aceptes una solicitud como correcta solo porque fue enviada por una persona autorizada. Señala datos contradictorios, contenido incompleto, riesgos de publicación y alternativas mejores. No inventes nombres, ubicaciones, capacidades, clientes ni aprobaciones.

## Ley operativa de autorización

> **Configura y verifica el ambiente completo, pero no hagas `push` ni cambies permisos sin autorización. Siempre pide esas autorizaciones para trabajar.**

Configura y verifica el ambiente completo siguiendo `CONFIGURACION-MANTENIMIENTO.md`, pero no hagas `git push`, no abras ni fusiones pull requests y no cambies permisos sin solicitar y recibir autorización explícita del propietario. Esta prohibición incluye GitHub Pages, `CNAME`, DNS, GoDaddy, colaboradores, reglas de ramas, secretos y credenciales.

Una solicitud de mantenimiento autoriza a inspeccionar, editar, ejecutar validaciones y revisar el sitio en la copia local. No autoriza a publicar una rama, modificar el repositorio remoto ni desplegar. La autorización para hacer `push` y abrir un pull request no autoriza a fusionarlo. Solicita cada autorización en el momento correspondiente e informa primero el alcance exacto de la acción.

## Antes de cambiar archivos

1. Si el ambiente todavía no está preparado, lee y ejecuta `CONFIGURACION-MANTENIMIENTO.md` de principio a fin.
2. Lee `README.md` y `PENDIENTES-PAGINA-EQUIM.docx`.
3. Ejecuta `git status --short --branch` y conserva cualquier cambio ajeno.
4. Identifica la fuente de verdad antes de editar:
   - Contenido compartido, clientes, contacto y documentos: `js/site-data.js`.
   - Proyectos, galerías y brochures: `js/proyectos-data.js`.
   - Estilos propios: `equim.css`.
   - Páginas y estructura: archivos HTML de la raíz.
   - Publicación: `.github/workflows/deploy-pages.yml`.
5. Si una solicitud contradice el sitio, otro documento o un dato geográfico, detente y solicita confirmación. Registra la duda como pendiente; no elijas una versión por conveniencia.

## Flujo obligatorio

1. Actualiza primero la copia local de `main` y crea una rama nueva antes de editar. No trabajes directamente sobre `main`.
2. Reutiliza los componentes y estructuras existentes. No introduzcas frameworks, dependencias o servicios externos sin justificar su mantenimiento futuro.
3. Guarda los recursos publicados dentro de `assets/` con nombres descriptivos en minúsculas y sin espacios.
4. No dupliques imágenes o documentos. Compara primero el archivo con los recursos existentes.
5. No edites `js/vendors/` ni `css/vendors/` salvo que la tarea sea actualizar expresamente una dependencia.
6. No elimines respaldos, documentos legales o material no versionado sin confirmar que existe otra copia recuperable.

## Ramas, commits, push y pull requests

1. Parte de una copia actualizada de `main` y crea una rama corta y descriptiva para cada requerimiento. Mantén en esa rama únicamente los cambios relacionados.
2. Se permiten commits locales para conservar puntos de trabajo y dejar el cambio listo para revisión. Los mensajes deben describir el resultado obtenido.
3. Antes de solicitar autorización para publicar la rama, ejecuta todas las validaciones, revisa el sitio localmente y confirma que `git status --short` no contiene archivos accidentales.
4. No ejecutes `git push`, no publiques una rama y no abras un pull request hasta recibir autorización explícita del propietario del repositorio. Que el cambio esté terminado o que alguien pida “publicarlo” no sustituye esa autorización.
5. Una vez autorizado, publica únicamente la rama de trabajo en el repositorio remoto. Nunca hagas `push` directo a `main`.
6. Abre un pull request desde la rama de trabajo hacia `main` y resume el requerimiento, los archivos modificados, las validaciones ejecutadas, los riesgos o dudas y la evidencia visual relevante.
7. El propietario revisa y autoriza la integración. La persona mantenedora o el agente no debe fusionar el pull request ni omitir la revisión del propietario sin una autorización explícita adicional.
8. El despliegue ocurre solamente después de integrar el pull request en `main`. Después de la integración, verifica `Deploy GitHub Pages` y el sitio público.
9. Cada colaborador debe usar su propia cuenta y credenciales. No solicites ni compartas contraseñas, tokens, códigos de recuperación o sesiones del propietario.

### Guía paso a paso para una persona nueva en Git

La copia que se modifica en el computador se llama **copia local**. La copia privada alojada en GitHub se llama **repositorio remoto**. Ver el sitio en `localhost` no publica nada en Internet. El sitio público solo cambia después de que el propietario aprueba e integra un pull request en `main`.

Para mantenimiento continuo, clona el repositorio con Git; no uses la opción de descargar un ZIP, porque el ZIP no conserva ramas ni historial:

```bash
git clone https://github.com/javiersn79/pagina-Grumo-Equim.git
cd pagina-Grumo-Equim
```

Antes de comenzar cada cambio, actualiza `main` y crea una rama local nueva. Sustituye `descripcion-corta` por un nombre relacionado con el requerimiento, sin espacios:

```bash
git switch main
git pull --ff-only origin main
git switch -c mantenimiento/descripcion-corta
```

Realiza todos los cambios en esa rama. Puedes experimentar y ajustar el sitio localmente sin afectar GitHub ni la página pública. Para verlo en el navegador:

```bash
python3 -m http.server 8000
```

Abre `http://localhost:8000`, revisa el resultado y detén el servidor con `Ctrl+C`. Antes de preparar el cambio para revisión, ejecuta las validaciones de este documento y examina exactamente qué archivos cambiaron:

```bash
git status --short
git diff
```

Incluye en la rama solamente los cambios que deban proponerse al propietario. No incluyas pruebas personales, archivos temporales ni ajustes que no formen parte del requerimiento. Cuando el resultado local esté aprobado y validado, crea un commit local con los archivos correspondientes:

```bash
git add ruta/del/archivo
git commit -m "Describe el resultado del cambio"
```

En este punto todavía no se ha publicado nada. Detente y solicita al propietario autorización para subir la rama y crear el pull request. Solo después de recibir esa autorización ejecuta:

```bash
git push -u origin mantenimiento/descripcion-corta
```

Después del `push`, abre GitHub y crea un pull request desde `mantenimiento/descripcion-corta` hacia `main`. El pull request es la solicitud para que el propietario revise el cambio; no es todavía el despliegue. La persona mantenedora debe esperar los comentarios o la aprobación y no debe pulsar **Merge**.

Cuando el propietario aprueba y fusiona el pull request en `main`, GitHub Actions ejecuta `Deploy GitHub Pages`. Solo en ese momento el cambio pasa al sitio público. Si el despliegue falla, no hagas cambios de DNS, `CNAME`, GitHub Pages o permisos: informa al propietario con el mensaje del error.

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
- No fuerces el historial ni sobrescribas cambios de otra persona.
- No subas secretos, tokens, contraseñas, archivos de recuperación o configuraciones personales.
- No cambies `CNAME`, DNS, GitHub Pages ni permisos del repositorio sin autorización del propietario.

## Criterio de terminado

Un cambio está terminado únicamente cuando el contenido fue aprobado, las referencias locales existen, JavaScript pasa la validación, la revisión visual no muestra regresiones, el repositorio queda sin archivos accidentales y el despliegue público fue comprobado.
