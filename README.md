# Sitio web de EQUIM GRUMO

Sitio corporativo estático publicado en [www.equimsas.com](https://www.equimsas.com) mediante GitHub Pages. El repositorio pertenece a `javiersn79`; las personas encargadas del mantenimiento trabajan como colaboradoras con sus propias cuentas.

## Tecnología

- HTML, CSS y JavaScript sin framework ni proceso de compilación.
- GitHub Actions para validar y publicar el contenido de `main`.
- GitHub Pages como alojamiento.
- GoDaddy como registrador y proveedor DNS del dominio.

## Páginas

- `index.html`: inicio.
- `nosotros.html`: historia y equipo visible.
- `soluciones.html`: líneas de negocio.
- `proyectos.html`: catálogo filtrable.
- `proyecto.html`: detalle dinámico de cada proyecto.
- `contacto.html`: datos de contacto.
- `reorganizacion.html`: documentos institucionales.
- `404.html`: página para rutas inexistentes.

## Fuentes de contenido

- `js/site-data.js`: navegación, clientes, contacto, documentos institucionales y textos compartidos.
- `js/proyectos-data.js`: catálogo, imágenes, galerías y brochures de proyectos.
- `equim.css`: estilos propios del sitio.
- `assets/`: imágenes, logos y documentos publicados.
- `PENDIENTES-PAGINA-EQUIM.docx`: requerimientos confirmados que todavía no deben darse por resueltos.

El orden de los objetos en `js/proyectos-data.js` define el orden del catálogo. `featured: true` controla los proyectos destacados.

## Trabajo local

```bash
git clone https://github.com/javiersn79/pagina-Grumo-Equim.git
cd pagina-Grumo-Equim
python3 -m http.server 8000
```

Abrir `http://localhost:8000`. No se deben abrir únicamente los HTML con doble clic porque algunas rutas y comportamientos deben probarse mediante un servidor local.

## Validación

Antes de enviar cambios:

```bash
python3 scripts/check-site.py
for file in js/*.js; do node --check "$file"; done
git status --short
```

Además, revisar visualmente inicio, navegación móvil, proyectos, detalle de proyecto, contacto, reorganización y la página 404.

## Flujo de cambios

1. Actualizar `main` localmente.
2. Crear una rama corta para el cambio.
3. Modificar únicamente las fuentes necesarias.
4. Ejecutar las validaciones y revisar el sitio en escritorio y móvil.
5. Crear un pull request hacia `main`.
6. Integrar después de revisar contenido, imágenes y enlaces.
7. Confirmar que la acción `Deploy GitHub Pages` termina correctamente y comprobar el sitio público.

No se deben subir contraseñas, tokens, archivos de recuperación, datos personales no autorizados ni material recibido sin aprobación para publicación.

## Publicación y dominio

Cada cambio integrado en `main` ejecuta `.github/workflows/deploy-pages.yml`. El despliegue copia el sitio estático, los recursos, `.nojekyll` y `CNAME`.

El dominio y DNS no están controlados por el código. El propietario del repositorio conserva el control administrativo de GitHub Pages y de GoDaddy. Cualquier cambio de dominio, DNS, HTTPS o propietario debe coordinarse con él.

## Responsabilidades

- La empresa aprueba textos, ubicaciones, clientes, fotografías y documentos legales.
- La persona mantenedora implementa, valida y documenta los cambios aprobados.
- El propietario del repositorio administra accesos, GitHub Pages, dominio y recuperación de las cuentas.

Las reglas operativas completas para personas y agentes de Codex están en `AGENTS.md`.
