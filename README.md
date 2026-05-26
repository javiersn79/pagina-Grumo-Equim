# EQUIM local

Base local para reconstruir la web corporativa de EQUIM a partir de la plantilla `tidy-v2`, ya depurada para un uso industrial y no SaaS.

## Estructura activa

- `index.html`: home corporativo.
- `nosotros.html`: historia y enfoque.
- `soluciones.html`: líneas de negocio.
- `proyectos.html`: catálogo filtrable.
- `proyecto.html`: detalle individual.
- `contacto.html`: datos directos.
- `reorganizacion.html`: página institucional secundaria.

## Mantenimiento de proyectos

El catálogo se alimenta desde dos archivos:

- `js/proyectos-data.js`: lista de proyectos.
- `js/proyectos.js`: render del home, listado, filtros y detalle.

El orden de `js/proyectos-data.js` define qué aparece primero como "últimos".

Cada proyecto usa este esquema mínimo:

```js
{
  title: "Nombre del proyecto",
  photo: "URL o ruta de imagen",
  summary: "Descripción corta",
  location: "Ubicación",
  client: "Cliente",
  category: "cereales | puertos | izaje",
  featured: true
}
```
