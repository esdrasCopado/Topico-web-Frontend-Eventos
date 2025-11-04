@echo off
REM ============================================
REM Script de Optimización de Videos para Windows
REM ============================================
REM
REM Uso: optimize-video.bat <archivo-video.mp4>
REM
REM Genera:
REM   - video.webm (formato optimizado WebM)
REM   - video_optimized.mp4 (MP4 optimizado)
REM   - video_poster.jpg (imagen de vista previa)
REM

echo.
echo ============================================
echo   Optimizador de Videos
echo   Frontend Proyecto Web
echo ============================================
echo.

REM Verificar que se proporcionó un archivo
if "%~1"=="" (
    echo ERROR: Debes proporcionar un archivo de video
    echo.
    echo Uso: optimize-video.bat mi-video.mp4
    echo.
    pause
    exit /b 1
)

REM Verificar que el archivo existe
if not exist "%~1" (
    echo ERROR: El archivo "%~1" no existe
    echo.
    pause
    exit /b 1
)

REM Verificar que FFmpeg está instalado
where ffmpeg >nul 2>nul
if %errorlevel% neq 0 (
    echo ERROR: FFmpeg no está instalado
    echo.
    echo Instala FFmpeg con Chocolatey:
    echo   choco install ffmpeg
    echo.
    echo O descárgalo desde: https://ffmpeg.org/download.html
    echo.
    pause
    exit /b 1
)

REM Obtener nombre base del archivo sin extensión
set "input=%~1"
set "basename=%~n1"
set "directory=%~dp1"

echo Archivo de entrada: %input%
echo Nombre base: %basename%
echo Directorio: %directory%
echo.

REM Crear carpetas si no existen
if not exist "%directory%optimized" mkdir "%directory%optimized"

REM ============================================
REM 1. Generar WebM (formato principal)
REM ============================================
echo [1/3] Generando WebM optimizado...
echo       Esto puede tardar varios minutos...
echo.

ffmpeg -i "%input%" ^
    -c:v libvpx-vp9 ^
    -crf 30 ^
    -b:v 0 ^
    -b:a 128k ^
    -c:a libopus ^
    -y ^
    "%directory%optimized\%basename%.webm"

if %errorlevel% neq 0 (
    echo ERROR: Falló la conversión a WebM
    pause
    exit /b 1
)

echo WebM generado exitosamente!
echo.

REM ============================================
REM 2. Generar MP4 optimizado (fallback)
REM ============================================
echo [2/3] Generando MP4 optimizado...
echo       Esto puede tardar varios minutos...
echo.

ffmpeg -i "%input%" ^
    -c:v libx264 ^
    -crf 23 ^
    -preset slow ^
    -c:a aac ^
    -b:a 128k ^
    -y ^
    "%directory%optimized\%basename%.mp4"

if %errorlevel% neq 0 (
    echo ERROR: Falló la conversión a MP4
    pause
    exit /b 1
)

echo MP4 generado exitosamente!
echo.

REM ============================================
REM 3. Generar poster (imagen de vista previa)
REM ============================================
echo [3/3] Generando imagen poster...
echo.

ffmpeg -i "%input%" ^
    -ss 00:00:05 ^
    -vframes 1 ^
    -q:v 2 ^
    -y ^
    "%directory%optimized\%basename%_poster.jpg"

if %errorlevel% neq 0 (
    echo ERROR: Falló la generación del poster
    pause
    exit /b 1
)

echo Poster generado exitosamente!
echo.

REM ============================================
REM Mostrar resultados
REM ============================================
echo ============================================
echo   OPTIMIZACION COMPLETA
echo ============================================
echo.
echo Archivos generados en: %directory%optimized\
echo.
echo   - %basename%.webm (formato principal)
echo   - %basename%.mp4 (fallback)
echo   - %basename%_poster.jpg (imagen de vista previa)
echo.

REM Mostrar tamaños de archivo
echo Tamaños de archivo:
echo.
for %%F in ("%directory%optimized\%basename%.webm") do echo   WebM:   %%~zF bytes (%%~zF / 1048576 MB)
for %%F in ("%directory%optimized\%basename%.mp4") do echo   MP4:    %%~zF bytes (%%~zF / 1048576 MB)
for %%F in ("%directory%optimized\%basename%_poster.jpg") do echo   Poster: %%~zF bytes
echo.

REM ============================================
REM Ejemplo de uso en código
REM ============================================
echo Ejemplo de uso en tu código:
echo.
echo const player = new VideoPlayer({
echo     sources: [
echo         { src: '/videos/%basename%.webm', type: 'video/webm' },
echo         { src: '/videos/%basename%.mp4', type: 'video/mp4' }
echo     ],
echo     poster: '/images/posters/%basename%_poster.jpg',
echo     controls: true
echo })
echo.

echo Copia los archivos a:
echo   - public/videos/%basename%.webm
echo   - public/videos/%basename%.mp4
echo   - public/images/posters/%basename%_poster.jpg
echo.
echo ============================================
echo.

pause
