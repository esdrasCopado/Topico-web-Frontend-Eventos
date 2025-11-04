#!/bin/bash

# ============================================
# Script de Optimización de Videos
# Frontend Proyecto Web
# ============================================
#
# Uso: ./optimize-video.sh <archivo-video.mp4>
#
# Genera:
#   - video.webm (formato optimizado WebM)
#   - video_optimized.mp4 (MP4 optimizado)
#   - video_poster.jpg (imagen de vista previa)
#

set -e  # Salir en caso de error

# Colores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo ""
echo "============================================"
echo "  Optimizador de Videos"
echo "  Frontend Proyecto Web"
echo "============================================"
echo ""

# Verificar que se proporcionó un archivo
if [ -z "$1" ]; then
    echo -e "${RED}ERROR: Debes proporcionar un archivo de video${NC}"
    echo ""
    echo "Uso: ./optimize-video.sh mi-video.mp4"
    echo ""
    exit 1
fi

# Verificar que el archivo existe
if [ ! -f "$1" ]; then
    echo -e "${RED}ERROR: El archivo '$1' no existe${NC}"
    echo ""
    exit 1
fi

# Verificar que FFmpeg está instalado
if ! command -v ffmpeg &> /dev/null; then
    echo -e "${RED}ERROR: FFmpeg no está instalado${NC}"
    echo ""
    echo "Instala FFmpeg:"
    echo "  macOS:   brew install ffmpeg"
    echo "  Linux:   sudo apt install ffmpeg"
    echo ""
    exit 1
fi

# Obtener información del archivo
INPUT="$1"
BASENAME=$(basename "$INPUT" | sed 's/\.[^.]*$//')
DIRECTORY=$(dirname "$INPUT")
OUTPUT_DIR="$DIRECTORY/optimized"

echo "Archivo de entrada: $INPUT"
echo "Nombre base: $BASENAME"
echo "Directorio: $DIRECTORY"
echo ""

# Crear carpeta de salida
mkdir -p "$OUTPUT_DIR"

# ============================================
# 1. Generar WebM (formato principal)
# ============================================
echo -e "${BLUE}[1/3] Generando WebM optimizado...${NC}"
echo "      Esto puede tardar varios minutos..."
echo ""

ffmpeg -i "$INPUT" \
    -c:v libvpx-vp9 \
    -crf 30 \
    -b:v 0 \
    -b:a 128k \
    -c:a libopus \
    -y \
    "$OUTPUT_DIR/$BASENAME.webm" 2>&1 | grep -E "frame=|time=|fps=|speed=" || true

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo -e "${RED}ERROR: Falló la conversión a WebM${NC}"
    exit 1
fi

echo -e "${GREEN}WebM generado exitosamente!${NC}"
echo ""

# ============================================
# 2. Generar MP4 optimizado (fallback)
# ============================================
echo -e "${BLUE}[2/3] Generando MP4 optimizado...${NC}"
echo "      Esto puede tardar varios minutos..."
echo ""

ffmpeg -i "$INPUT" \
    -c:v libx264 \
    -crf 23 \
    -preset slow \
    -c:a aac \
    -b:a 128k \
    -y \
    "$OUTPUT_DIR/$BASENAME.mp4" 2>&1 | grep -E "frame=|time=|fps=|speed=" || true

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo -e "${RED}ERROR: Falló la conversión a MP4${NC}"
    exit 1
fi

echo -e "${GREEN}MP4 generado exitosamente!${NC}"
echo ""

# ============================================
# 3. Generar poster (imagen de vista previa)
# ============================================
echo -e "${BLUE}[3/3] Generando imagen poster...${NC}"
echo ""

ffmpeg -i "$INPUT" \
    -ss 00:00:05 \
    -vframes 1 \
    -q:v 2 \
    -y \
    "$OUTPUT_DIR/${BASENAME}_poster.jpg" 2>&1 | grep -v "^frame=" || true

if [ ${PIPESTATUS[0]} -ne 0 ]; then
    echo -e "${RED}ERROR: Falló la generación del poster${NC}"
    exit 1
fi

echo -e "${GREEN}Poster generado exitosamente!${NC}"
echo ""

# ============================================
# Mostrar resultados
# ============================================
echo "============================================"
echo "  OPTIMIZACION COMPLETA"
echo "============================================"
echo ""
echo "Archivos generados en: $OUTPUT_DIR/"
echo ""
echo "  - $BASENAME.webm (formato principal)"
echo "  - $BASENAME.mp4 (fallback)"
echo "  - ${BASENAME}_poster.jpg (imagen de vista previa)"
echo ""

# Mostrar tamaños de archivo
echo "Tamaños de archivo:"
echo ""

# Función para formatear tamaño
format_size() {
    local size=$1
    if [ $size -lt 1024 ]; then
        echo "${size} bytes"
    elif [ $size -lt 1048576 ]; then
        echo "$(($size / 1024)) KB"
    else
        echo "$(($size / 1048576)) MB"
    fi
}

WEBM_SIZE=$(stat -f%z "$OUTPUT_DIR/$BASENAME.webm" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$BASENAME.webm" 2>/dev/null)
MP4_SIZE=$(stat -f%z "$OUTPUT_DIR/$BASENAME.mp4" 2>/dev/null || stat -c%s "$OUTPUT_DIR/$BASENAME.mp4" 2>/dev/null)
POSTER_SIZE=$(stat -f%z "$OUTPUT_DIR/${BASENAME}_poster.jpg" 2>/dev/null || stat -c%s "$OUTPUT_DIR/${BASENAME}_poster.jpg" 2>/dev/null)

echo "  WebM:   $(format_size $WEBM_SIZE)"
echo "  MP4:    $(format_size $MP4_SIZE)"
echo "  Poster: $(format_size $POSTER_SIZE)"
echo ""

# Calcular ahorro de espacio comparado con el original
ORIGINAL_SIZE=$(stat -f%z "$INPUT" 2>/dev/null || stat -c%s "$INPUT" 2>/dev/null)
SAVINGS=$(( (ORIGINAL_SIZE - WEBM_SIZE) * 100 / ORIGINAL_SIZE ))

echo -e "${YELLOW}Original:${NC} $(format_size $ORIGINAL_SIZE)"
echo -e "${GREEN}Ahorro:${NC}   $SAVINGS% (WebM vs Original)"
echo ""

# ============================================
# Ejemplo de uso en código
# ============================================
echo "Ejemplo de uso en tu código:"
echo ""
echo -e "${BLUE}const player = new VideoPlayer({
    sources: [
        { src: '/videos/$BASENAME.webm', type: 'video/webm' },
        { src: '/videos/$BASENAME.mp4', type: 'video/mp4' }
    ],
    poster: '/images/posters/${BASENAME}_poster.jpg',
    controls: true
})${NC}"
echo ""

echo "Copia los archivos a:"
echo "  - public/videos/$BASENAME.webm"
echo "  - public/videos/$BASENAME.mp4"
echo "  - public/images/posters/${BASENAME}_poster.jpg"
echo ""
echo "============================================"
echo ""

# Preguntar si desea copiar automáticamente
read -p "¿Copiar archivos a public/ automáticamente? (s/N): " -n 1 -r
echo ""

if [[ $REPLY =~ ^[Ss]$ ]]; then
    # Buscar carpeta public
    if [ -d "../public/videos" ]; then
        PUBLIC_DIR="../public"
    elif [ -d "./public/videos" ]; then
        PUBLIC_DIR="./public"
    elif [ -d "../../public/videos" ]; then
        PUBLIC_DIR="../../public"
    else
        echo -e "${YELLOW}No se encontró la carpeta public/videos${NC}"
        echo "Copia los archivos manualmente"
        exit 0
    fi

    # Crear carpetas si no existen
    mkdir -p "$PUBLIC_DIR/videos"
    mkdir -p "$PUBLIC_DIR/images/posters"

    # Copiar archivos
    cp "$OUTPUT_DIR/$BASENAME.webm" "$PUBLIC_DIR/videos/"
    cp "$OUTPUT_DIR/$BASENAME.mp4" "$PUBLIC_DIR/videos/"
    cp "$OUTPUT_DIR/${BASENAME}_poster.jpg" "$PUBLIC_DIR/images/posters/"

    echo -e "${GREEN}Archivos copiados exitosamente a $PUBLIC_DIR${NC}"
    echo ""
fi

echo -e "${GREEN}Proceso completado!${NC}"
