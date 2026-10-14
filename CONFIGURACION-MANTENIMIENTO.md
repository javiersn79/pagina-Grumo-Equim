# Configuración del ambiente de mantenimiento de EQUIM GRUMO

Esta guía permite preparar desde cero un computador para mantener el sitio de EQUIM-GRUMO. Windows es el entorno principal esperado. El objetivo es que una persona o un agente pueda clonar el repositorio privado, trabajar en una rama, revisar el sitio localmente y dejar un cambio listo para revisión sin alterar por accidente el repositorio remoto ni GitHub Pages.

## Regla obligatoria de autorización

> Configura y verifica el ambiente completo, pero no hagas `push`, no abras ni fusiones pull requests y no cambies permisos sin autorización explícita del propietario.

Esta regla también incluye GitHub Pages, `CNAME`, DNS, GoDaddy, colaboradores, reglas de ramas, secretos y credenciales. Una solicitud general de mantenimiento autoriza a leer, editar y probar la copia local; no autoriza a publicar ni a cambiar accesos.

Cuando el trabajo local esté listo, informa qué cambió y qué validaciones pasaron. Después solicita autorización para subir la rama y crear el pull request. La autorización para subir una rama no autoriza a fusionarla.

## Qué se necesita

- Una cuenta personal de GitHub con autenticación de dos factores.
- Una invitación aceptada como colaboradora del repositorio privado.
- Git 2.23 o posterior.
- Python 3.10 o posterior.
- Node.js 18 o posterior, preferiblemente una versión LTS vigente.
- Un navegador moderno.
- Un editor como Visual Studio Code.
- Microsoft Word o LibreOffice para leer `PENDIENTES-PAGINA-EQUIM.docx`.
- Codex en la aplicación de escritorio o en una herramienta compatible.

El sitio no usa framework, base de datos ni dependencias npm. No ejecutes `npm install` porque este repositorio no lo necesita.

## Configuración principal en Windows

### 1. Instalar las herramientas

Descarga e instala cada herramienta desde su sitio oficial:

1. Git para Windows: `https://git-scm.com/download/win`
2. Python para Windows: `https://www.python.org/downloads/windows/`
3. Node.js LTS: `https://nodejs.org/`
4. Visual Studio Code, si se va a utilizar: `https://code.visualstudio.com/`
5. ChatGPT para Windows y acceso a Codex: `https://chatgpt.com/download/`

Durante la instalación de Python, activa la opción para agregar Python al `PATH`. Git para Windows incluye Git Credential Manager, que puede abrir el navegador para autenticar el acceso a GitHub.

La aplicación de Codex puede utilizarse después de iniciar sesión, elegir la carpeta del repositorio como proyecto y abrir un chat nuevo. La [documentación oficial de OpenAI para comenzar con Codex](https://developers.openai.com/learn/developers-codex-plugin) incluye la aplicación para Windows, y la [guía oficial de instrucciones para Codex](https://developers.openai.com/cookbook/examples/gpt-5/codex_prompting_guide) explica que Codex carga los archivos `AGENTS.md` del repositorio. Este sitio no usa la API de OpenAI, por lo que no necesita una API key ni el plugin OpenAI Developers.

### 2. Abrir PowerShell y comprobar las instalaciones

Abre una ventana nueva de PowerShell y ejecuta:

```powershell
git --version
py --version
node --version
```

Los tres comandos deben mostrar una versión. Si `py` no existe, prueba `python --version`. Si un comando no se reconoce, cierra y vuelve a abrir PowerShell; si continúa fallando, corrige la instalación antes de clonar el repositorio.

### 3. Configurar la identidad personal de Git

Cada colaborador utiliza su propia identidad. Sustituye los valores del ejemplo:

```powershell
git config --global user.name "Nombre de la mantenedora"
git config --global user.email "correo-asociado-a-github@ejemplo.com"
git config --global credential.helper manager
```

Comprueba la configuración sin mostrar credenciales:

```powershell
git config --global user.name
git config --global user.email
```

Nunca copies contraseñas, tokens, códigos de recuperación o sesiones del propietario. Si GitHub solicita autenticación, inicia sesión con la cuenta personal de la colaboradora.

### 4. Clonar el repositorio privado

No descargues un ZIP. El ZIP no incluye ramas ni historial y no sirve para el flujo de mantenimiento.

En PowerShell:

```powershell
New-Item -ItemType Directory -Force C:\Proyectos | Out-Null
Set-Location C:\Proyectos
git clone https://github.com/javiersn79/pagina-Grumo-Equim.git
Set-Location pagina-Grumo-Equim
```

GitHub puede abrir el navegador para iniciar sesión. Si aparece `Repository not found`, confirma que la invitación fue aceptada y que se está usando la cuenta correcta. No solicites la contraseña o el token del propietario.

Evita trabajar dentro de carpetas temporales o sincronizadas automáticamente por OneDrive si esa sincronización bloquea archivos o crea duplicados.

### 5. Verificar automáticamente el ambiente

Desde la raíz del repositorio ejecuta:

```powershell
py scripts/check-environment.py --remote
```

Si en el equipo se usa `python` en lugar de `py`:

```powershell
python scripts/check-environment.py --remote
```

El comando comprueba las herramientas, la identidad de Git, los archivos esenciales, el origen remoto, el acceso de lectura a `main`, las referencias locales y la sintaxis JavaScript. No hace `push` ni cambia permisos.

Corrige todos los mensajes marcados como `ERROR`. Los mensajes `AVISO` requieren revisión, pero no siempre impiden trabajar.

### 6. Abrir el proyecto en Codex o en el editor

Abre exactamente la carpeta `C:\Proyectos\pagina-Grumo-Equim`. Antes de modificar archivos, la persona o el agente debe leer, en este orden:

1. `AGENTS.md`
2. `README.md`
3. `PENDIENTES-PAGINA-EQUIM.docx`
4. Esta guía

Prompt recomendado para el agente de configuración:

```text
Lee AGENTS.md, README.md, PENDIENTES-PAGINA-EQUIM.docx y CONFIGURACION-MANTENIMIENTO.md. Configura y verifica el ambiente completo. Puedes inspeccionar, editar y probar la copia local, pero no hagas push, no abras ni fusiones pull requests y no cambies permisos, GitHub Pages, CNAME o DNS sin solicitar y recibir autorización explícita del propietario.
```

## Flujo de mantenimiento en Windows

### 1. Actualizar `main` y crear una rama

Antes de cada requerimiento:

```powershell
git switch main
git pull --ff-only origin main
git switch -c mantenimiento/descripcion-corta
```

Sustituye `descripcion-corta` por un nombre breve sin espacios, por ejemplo `mantenimiento/actualizar-contacto`. No edites directamente en `main`.

### 2. Trabajar y revisar localmente

Realiza los cambios únicamente en la rama. Para iniciar el sitio:

```powershell
py -m http.server 8000
```

Abre `http://localhost:8000`. Revisa escritorio y móvil. Para detener el servidor, vuelve a PowerShell y pulsa `Ctrl+C`.

Ver el sitio en `localhost` no lo publica en Internet y no modifica GitHub Pages.

### 3. Ejecutar las validaciones

```powershell
py scripts/check-environment.py
py scripts/check-site.py
Get-ChildItem js -Filter *.js | ForEach-Object { node --check $_.FullName }
git diff --check
git status --short
git diff
```

Comprueba además las páginas indicadas en `AGENTS.md`. No prepares un cambio con errores, referencias faltantes, contenido sin autorización o archivos accidentales.

### 4. Crear un commit local

Agrega únicamente los archivos del requerimiento; no uses `git add .` sin revisar antes `git status`:

```powershell
git add ruta\del\archivo
git commit -m "Describe el resultado del cambio"
```

El commit sigue estando únicamente en el computador. Informa al propietario:

- nombre de la rama;
- resumen del cambio;
- archivos modificados;
- validaciones ejecutadas;
- dudas, riesgos o contenido pendiente de aprobación.

### 5. Solicitar autorización para publicar la rama

Detente aquí. No ejecutes `git push` hasta que el propietario autorice expresamente subir esa rama y crear el pull request.

Después de recibir autorización:

```powershell
git push -u origin mantenimiento/descripcion-corta
```

Abre GitHub y crea un pull request desde la rama publicada hacia `main`. No pulses **Merge**. El propietario revisa, solicita ajustes si son necesarios y decide si integra el cambio.

### 6. Despliegue

El sitio se despliega únicamente cuando el propietario fusiona el pull request en `main`. GitHub Actions ejecuta `Deploy GitHub Pages`. La persona mantenedora puede comprobar el resultado y `https://www.equimsas.com`, pero no debe cambiar Pages, `CNAME`, DNS o permisos para corregir un fallo sin autorización.

## Configuración en macOS o Linux

El flujo es el mismo. Instala Git, Python 3 y Node.js LTS con los medios oficiales o el gestor de paquetes aprobado para el equipo. Utiliza:

```bash
git --version
python3 --version
node --version
git clone https://github.com/javiersn79/pagina-Grumo-Equim.git
cd pagina-Grumo-Equim
python3 scripts/check-environment.py --remote
python3 -m http.server 8000
```

Para validar JavaScript:

```bash
for file in js/*.js; do node --check "$file"; done
```

Las reglas de autorización, ramas y pull requests son idénticas en todos los sistemas operativos.

## Problemas frecuentes

### GitHub indica que el repositorio no existe

- Confirma que la invitación al repositorio privado fue aceptada.
- Confirma que el navegador inició sesión con la cuenta de la colaboradora.
- No cambies la visibilidad ni los permisos del repositorio.

### PowerShell no reconoce `py`, `git` o `node`

- Cierra y abre PowerShell después de instalar.
- Revisa que la herramienta se haya agregado al `PATH`.
- Vuelve a ejecutar los comandos de versión.
- No continúes hasta que `scripts/check-environment.py` pueda ejecutarse.

### El puerto 8000 está ocupado

Detén el servidor anterior con `Ctrl+C` o utiliza temporalmente otro puerto:

```powershell
py -m http.server 8001
```

Luego abre `http://localhost:8001`.

### Aparecen cambios que la persona no hizo

Detente. Ejecuta `git status --short` y consulta al propietario. No descartes, sobrescribas, confirmes ni publiques cambios ajenos.

### El `push` o el despliegue falla

Guarda el mensaje completo del error y comunícalo al propietario. No fuerces el historial, no uses credenciales ajenas y no cambies permisos, reglas de ramas, GitHub Pages, `CNAME` o DNS.

## Ambiente listo

El ambiente está preparado únicamente cuando:

- las herramientas muestran versiones compatibles;
- la colaboradora usa su propia cuenta e identidad;
- el repositorio fue clonado con Git;
- `scripts/check-environment.py --remote` termina sin errores;
- se leyeron las instrucciones y pendientes;
- el sitio carga en `localhost`;
- las validaciones pasan;
- se entiende que `push`, pull request, merge y cambios de permisos requieren las autorizaciones definidas.
