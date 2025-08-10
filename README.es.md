## ??  Conversor de Documentos (PDF, Word, Imágenes, etc.)

Este proyecto es una aplicación web que permite convertir documentos entre diferentes formatos como PDF, DOCX, imágenes, etc. Utiliza Node.js, Express y varias librerías especializadas para manejar conversiones, compresión y procesamiento de archivos.

---



## ?? Funcionalidades

- Subida de archivos desde el navegador
- Conversión entre diferentes formatos
- Descarga automática del archivo convertido
- Compresión ZIP (si hay múltiples archivos)
- Interfaz amigable desarrollada en HTML, CSS y JS puro

---

## ?? Tecnologias usadas

- **Node.js**
- **Express**
- **multer** (para subir archivos)
- **office-to-pdf** (convertir documentos Office a PDF)
- **pdf-lib**, **pdfkit** (manipulación de PDF)
- **sharp** (procesamiento de imágenes)
- **archiver** (crear archivos ZIP)
- **mammoth** (extraer contenido de Word sin formato)

---

## ?? Estructura del proyecto


?? pdf-converter/
������ ?? public/ # Archivos del frontend (HTML, CSS, JS)
������ ?? uploads/ # Archivos subidos por el usuario
������ ?? outputs/ # Archivos convertidos listos para descargar
������ ?? index.js # Punto de entrada del servidor (Express)
������ ?? package.json # Dependencias y scripts
������ ?? test-libreoffice.js # Script de prueba para conversiones

---

## ?? Instalacion y uso

bash
# Clonar el repositorio
git clone https://github.com/NicoPaez95/pdf-converter.git

# Entrar al proyecto
cd pdf-converter

# Instalar dependencias
npm install

# Ejecutar la app en modo desarrollo
npm run dev

La aplicacion estara corriendo en:
 http://localhost:3000

## ?? Contacto

- GitHub: [MI PERFIL DE GITHUB](https://github.com/NicoPaez95)
- Email: nicopaezdev@josenicolaspaez.com
- LinkedIn: [MI PERFIL DE LINKEDIN](https://https://www.linkedin.com/in/jose-paez-a4b954207/)
---

## ?? Disponible en Ingles

Este proyecto est�� disponible tambi��n en Ingles. Pod��s leer la versi��n en `README.md`.

---


## ?? Nota final

Desarroll�� este proyecto como parte de mi portafolio, para demostrar mi capacidad para trabajar con tecnolog��as modernas, aplicar buenas pr��cticas de arquitectura limpia, y crear experiencias atractivas y funcionales desde el backend hasta el frontend.
