## ??  Conversor de Documentos (PDF, Word, Im谩genes, etc.)

Este proyecto es una aplicaci贸n web que permite convertir documentos entre diferentes formatos como PDF, DOCX, im谩genes, etc. Utiliza Node.js, Express y varias librer铆as especializadas para manejar conversiones, compresi贸n y procesamiento de archivos.

---



## ?? Funcionalidades

- Subida de archivos desde el navegador
- Conversi贸n entre diferentes formatos
- Descarga autom谩tica del archivo convertido
- Compresi贸n ZIP (si hay m煤ltiples archivos)
- Interfaz amigable desarrollada en HTML, CSS y JS puro

---

## ?? Tecnologias usadas

- **Node.js**
- **Express**
- **multer** (para subir archivos)
- **office-to-pdf** (convertir documentos Office a PDF)
- **pdf-lib**, **pdfkit** (manipulaci贸n de PDF)
- **sharp** (procesamiento de im谩genes)
- **archiver** (crear archivos ZIP)
- **mammoth** (extraer contenido de Word sin formato)

---

## ?? Estructura del proyecto


?? pdf-converter/
├── ?? public/ # Archivos del frontend (HTML, CSS, JS)
├── ?? uploads/ # Archivos subidos por el usuario
├── ?? outputs/ # Archivos convertidos listos para descargar
├── ?? index.js # Punto de entrada del servidor (Express)
├── ?? package.json # Dependencias y scripts
├── ?? test-libreoffice.js # Script de prueba para conversiones

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

Este proyecto está disponible también en Ingles. Podés leer la versión en `README.md`.

---


## ?? Nota final

Desarrollé este proyecto como parte de mi portafolio, para demostrar mi capacidad para trabajar con tecnologías modernas, aplicar buenas prácticas de arquitectura limpia, y crear experiencias atractivas y funcionales desde el backend hasta el frontend.
