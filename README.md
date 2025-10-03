# 🧩 Document Converter App (PDF, Word, Images, etc.)

This is a web application that allows you to convert documents between various formats such as PDF, DOCX, and images. It's built with Node.js, Express, and several specialized libraries for handling file conversion, compression, and processing.

---


## 🚀 Features

- Upload files directly from the browser
- Convert between multiple formats (PDF, Word, images)
- Automatically download the converted file
- ZIP compression for multiple converted files
- Clean and simple frontend with HTML, CSS, and vanilla JS

---

## 🧪 Technologies Used

- **Node.js**
- **Express**
- **multer** – for handling file uploads
- **office-to-pdf** – converts Office files to PDF
- **pdf-lib**, **pdfkit** – manipulate and generate PDF files
- **sharp** – image processing
- **archiver** – for ZIP compression
- **mammoth** – clean Word document content extraction

---

## 📁 Project Structure

📂 pdf-converter/
├── 📁 public/ # Frontend files (HTML, CSS, JS)
├── 📁 uploads/ # Uploaded files from users
├── 📁 outputs/ # Converted files ready to download
├── 📁 output/ # ⚠️ (Consider merging this with "outputs" for clarity)
├── 📄 index.js # Server entry point (Express app)
├── 📄 package.json # Project dependencies and scripts
├── 📄 test-libreoffice.js # Test script for LibreOffice conversion


---

## ⚙️ Installation and Usage

bash
# Clone the repository
git clone https://github.com/NicoPaez95/pdf-converter.git

# Navigate into the project
cd pdf-converter

# Install dependencies
npm install

# Run the app in development mode
npm run dev


Once started, the app will be available at:
📍 http://localhost:3000
---

## 📬 Contact

- GitHub: [@NicoPaez95](https://github.com/NicoPaez95)
- Email: nicopaezdev@josenicolaspaez.com
- LinkedIn: [Jose Paez](https://www.linkedin.com/in/jose-paez-a4b954207/)

---
---

## 📘 Available in Spanish

This project is also available in Spanish. You can read the translated version in `README.es.md`.

---


## 🙌 Final Note

I built this project as part of my personal portfolio to showcase my ability to work across the full stack, apply clean architecture principles, and build engaging, functional experiences — from backend to frontend.
