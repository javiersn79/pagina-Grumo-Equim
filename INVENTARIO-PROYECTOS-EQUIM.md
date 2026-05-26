# Inventario inicial de proyectos EQUIM

## Conclusión rápida

Sí, una parte importante del contenido de `Proyectos` parece recuperable desde el sitio original.

Pero no conviene copiarlo sin criterio porque hoy viene mezclado en formatos distintos:

- páginas de soluciones,
- fichas de equipos,
- posts individuales,
- galerías heredadas del CMS.

La estrategia correcta es rescatar el contenido útil y normalizarlo.

## Qué pude verificar del sitio original

En resultados indexados y páginas visibles aparecen contenidos que sí sirven como base para reconstruir el portafolio.

Ejemplos detectados:

- `Izaje y montaje`
  Fuente: [equimsas.com/izaje-y-montaje](https://equimsas.com/izaje-y-montaje/)
  Valor:
  reúne equipos, casos y ubicaciones para agroindustria y sector petrolero.

- `Tolvas graneleras`
  Fuente: [equimsas.com/tolvas-graneleras](https://equimsas.com/tolvas-graneleras/)
  Valor:
  muestra solución para manejo y transporte de granos en puerto marítimo.

- `Horno ciclónico de biomasas en suspensión para secadoras de torre`
  Fuente: [equimsas.com/horno-ciclonico-de-biomasas-en-suspension-para-secadoras-de-torre](https://equimsas.com/horno-ciclonico-de-biomasas-en-suspension-para-secadoras-de-torre/)
  Valor:
  incluye descripción técnica, capacidad y respaldo de experiencia.

- `Horno ciclónico de biomasas en suspensión para albercas`
  Fuente: [equimsas.com/horno-ciclonico-de-biomasas-en-suspension-para-albercas](https://equimsas.com/horno-ciclonico-de-biomasas-en-suspension-para-albercas/)
  Valor:
  muestra otra variante de equipo dentro de secamiento de cereales.

- `agro-02`
  Fuente indexada: [equimsas.com/agro-02](https://equimsas.com/agro-02/)
  Valor:
  evidencia que existen casos sueltos de montaje con ubicación y descripción breve.

## Qué problema tiene hoy la estructura original

El portafolio no parece estar modelado como un catálogo.

Más bien parece construido por acumulación entre 2017 y años posteriores:

- páginas de línea de negocio,
- entradas de proyecto muy cortas,
- galerías por imagen,
- taxonomías poco claras,
- navegación débil entre casos.

Eso puede explicar por qué la sensación actual es que `Proyectos` no carga bien o no se entiende bien, incluso cuando sí hay contenido valioso detrás.

## Qué contenido sí vale la pena rescatar

### Rescatable casi seguro

- títulos de equipos o proyectos,
- ubicaciones,
- categorías técnicas,
- descripciones cortas,
- algunas capacidades o datos técnicos,
- imágenes principales,
- logos o referencias de clientes cuando estén claros.

### Rescatable con revisión manual

- nombres exactos de clientes,
- años del proyecto,
- especificaciones técnicas inconsistentes,
- imágenes sin contexto,
- textos duplicados entre páginas.

### No conviene heredar tal cual

- estructura de post del CMS,
- etiquetas o categorías del WordPress,
- bloques repetidos de clientes dentro de cada página,
- textos de navegación incrustados en resultados antiguos,
- formatos demasiado largos o demasiado técnicos para el home.

## Propuesta de reorganización

En vez de tratar cada URL antigua como una página final, conviene normalizar el contenido en un catálogo con tres niveles:

### 1. Categorías principales

- Agroindustria de cereales
- Puertos y manejo de granos
- Izaje y montaje

### 2. Tarjetas de proyecto

Cada proyecto debería resumirse en una ficha uniforme con:

- nombre,
- categoría,
- ubicación,
- resumen,
- imagen principal,
- cliente si aplica.

### 3. Información ampliada opcional

Si más adelante vale la pena, cada ficha puede abrir:

- galería,
- detalle técnico,
- equipos utilizados,
- alcance del trabajo.

## Modelo recomendado para actualización fácil

Para esta etapa local conviene usar una sola fuente de datos.

La recomendación inicial es un archivo como:

- `tidy-v2/js/proyectos-data.js`

Con una estructura tipo:

```js
window.EQUIM_PROJECTS = [
  {
    slug: "tolvas-graneleras",
    title: "Tolvas graneleras",
    category: "puertos",
    solutionType: "Manejo y transporte de granos",
    client: "",
    location: "Puerto Príncipe, Haití",
    year: "",
    summary: "Sistema para almacenamiento y llenado de café a granel en contenedores.",
    capabilities: ["diseno", "fabricacion", "montaje"],
    equipment: ["tolvas", "transportadores", "elevador de cangilones"],
    image: "./assets/user-images/proyecto-tolvas.jpg",
    featured: true,
    sourceUrl: "https://equimsas.com/tolvas-graneleras/"
  }
];
```

## Por qué este modelo es mejor para esta etapa

- Evita depender de la estructura rota o incoherente del sitio viejo.
- Permite usar los mismos datos en el home y en `proyectos.html`.
- Facilita agregar, ocultar o destacar proyectos sin editar varios HTML.
- Funciona mejor en local que un `JSON` cargado con `fetch()` si el sitio se abre sin servidor.

## Recomendación editorial

No llamaría todo `proyecto` de forma rígida.

Hay por lo menos tres tipos de contenido mezclados en el sitio viejo:

- equipos,
- soluciones,
- casos de ejecución.

Si no los diferenciamos, el catálogo vuelve a quedar confuso.

Mi recomendación es usar esta lógica:

- `Soluciones` para líneas técnicas y tipos de equipos.
- `Proyectos` para casos ejecutados o implementaciones.
- Fichas técnicas puntuales solo si realmente agregan valor comercial.

## Siguiente paso sugerido

Cuando entremos a la fase 2 o 3, conviene:

1. Crear la página `proyectos.html`.
2. Crear `proyectos-data.js` con una primera tanda de casos rescatados.
3. Mostrar en el home solo 3 a 6 destacados.
4. Dejar el catálogo preparado para crecer sin rehacer la estructura.
