//index.js
//Required modules/Módulos requeridos / 
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { PDFDocument } = require("pdf-lib");
const archiver = require("archiver");

const app = express();
const PORT = process.env.PORT || 5000;

//Create directories if not exist/ Crear carpetas si no existen  
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "outputs");
[uploadDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

//  Multer storage setup/Configuración de almacenamiento con Multer
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const name = Date.now().toString(16) + path.extname(file.originalname);
    cb(null, name);
  }
});
const upload = multer({ storage });

// // Serve static files from the public folder/Servir archivos estáticos desde la carpeta public
app.use(express.static(path.join(__dirname, "public")));

//Route for the error page/ Ruta para la página de error
app.get("/error.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "error.html"));
});

// Route for the 500 page/ Ruta para la página 500
app.get("/500.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "500.html"));
});

// Route for the 404 page/ Ruta para la página 404
app.get("/404.html", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "404.html"));
});

// Main route - serve index.html/ Ruta principal - servir el index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

/// Route to test errors manually/ Ruta para probar errores manualmente
app.get("/test-error", (req, res) => {
  const errorMessage = encodeURIComponent("Este es un error forzado para pruebas");
  res.redirect(`/error.html?message=${errorMessage}`);
});

// Route to test 500 errors manually/ Ruta para probar errores 500 manualmente
app.get("/test-500", (req, res) => {
  // Forzar un error
  throw new Error("Este es un error de prueba 500 forzado desde el servidor");
});

//Route to test asynchronous 500 errors/ Ruta para probar errores 500 asíncronos
app.get("/test-async-error", async (req, res, next) => {
  try {
    // Simulate an asynchronous operation that fails/Simular una operación asíncrona que falla
    await Promise.reject(new Error("Error asíncrono de prueba"));
  } catch (error) {
    next(error); // Pasar el error al middleware de manejo de errores/Simulate an asynchronous operation that fails
  }
});

// Simulate an asynchronous operation that fails/Ruta para log de errores (opcional)
app.post("/api/error-log", express.json(), (req, res) => {
  console.log("📝 Error reportado:", req.body);
  res.status(200).send({ status: "logged" });
});

// / Send file and clean up/Enviar archivo y limpiar 
function sendFileAndCleanup(res, outputPath, inputPath, originalName, toFormat, extraPaths = []) {
  // Generate a more user-friendly file name/Generar un nombre de archivo más amigable
  const baseName = path.parse(originalName).name; //Get the name without the extension/ Obtener el nombre sin extensión
  let extension;

  //Determine the file extension according to the target format./ Determinar la extensión según el formato de destino
  switch (toFormat) {
    case 'pdf':
      extension = '.pdf';
      break;
    case 'image':
      extension = '.zip'; //Since it's a ZIP file of images/ Ya que es un zip de imágenes
      break;
    case 'word':
      extension = '.docx';
      break;
    default:
      extension = path.extname(outputPath);
  }

  const friendlyName = `Convertido_${baseName}${extension}`;

  //Configure headers for download/ Configurar headers para la descarga
  res.setHeader('Content-Disposition', `attachment; filename="${friendlyName}"`);

  // Send the file/Enviar el archivo
  res.sendFile(outputPath, err => {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    extraPaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
    if (err) console.error('❌ Error al enviar archivo / Error sending file:', err);
  });
}

// Main conversion route/ Ruta principal de conversión
app.post("/convert", upload.single("file"), async (req, res, next) => {
  if (!req.file) {
    const errorMessage = encodeURIComponent("No se subió ningún archivo. / No file uploaded.");
    return res.redirect(`/error.html?message=${errorMessage}`);
  }

  const filePath = req.file.path;
  const originalName = req.file.originalname;
  const from = req.body.fromFormat;
  const to = req.body.to;
  const ext = path.extname(originalName).toLowerCase();
  const outputFileName = Date.now().toString(16);
  const isWin = process.platform === "win32";
  const soffice = isWin ? "C:\\Program Files\\LibreOffice\\program\\soffice.exe" : "soffice";
  const pdftoppm = isWin ? "C:\\poppler-24\\bin\\pdftoppm.exe" : "pdftoppm";

  try {
    // Verify that the conversion is valid (additional protection on the backend)/Verificar si la conversión es válida (protección adicional en el backend)
    const validConversions = {
      word: ['pdf'],
      image: ['pdf'],
      pdf: ['image'] //Removed 'word' due to conversion issues/ Eliminado 'word' por problemas de conversión
    };

    if (!validConversions[from] || !validConversions[from].includes(to)) {
      fs.unlinkSync(filePath);
      // Redirect to the error page/Redirigir a la página de error
      const errorMessage = encodeURIComponent("Conversión no soportada. / Conversion not supported.");
      return res.redirect(`/error.html?message=${errorMessage}`);
    }

    // Word → PDF
    if (from === "word" && to === "pdf") {
      const cmd = `"${soffice}" --headless --convert-to pdf "${filePath}" --outdir "${outputDir}"`;
      await execPromise(cmd);
      const pdfPath = path.join(outputDir, path.basename(filePath, ext) + ".pdf");
      if (!fs.existsSync(pdfPath)) throw new Error("No se generó el PDF. / PDF was not generated.");
      return sendFileAndCleanup(res, pdfPath, filePath, originalName, to);
    }

    // Imagen → PDF / Image to PDF
    if (from === "image" && to === "pdf") {
      const imageBytes = fs.readFileSync(filePath);
      const pdfDoc = await PDFDocument.create();
      const image = await pdfDoc
        .embedJpg(imageBytes)
        .catch(() => pdfDoc.embedPng(imageBytes));
      const page = pdfDoc.addPage([image.width, image.height]);
      page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height });
      const pdfBytes = await pdfDoc.save();
      const outputPath = path.join(outputDir, outputFileName + ".pdf");
      fs.writeFileSync(outputPath, pdfBytes);
      return sendFileAndCleanup(res, outputPath, filePath, originalName, to);
    }

    // PDF → Imagen / PDF to Image
    if (from === "pdf" && to === "image") {
      const outputPrefix = path.join(outputDir, outputFileName);
      const cmd = `"${pdftoppm}" -png "${filePath}" -singlefile "${outputPrefix}"`;
      await execPromise(cmd);
      const images = fs.readdirSync(outputDir).filter(f => f.startsWith(outputFileName));
      if (images.length === 0) throw new Error("No se generaron imágenes. / No images were generated.");
      const zipName = outputPrefix + ".zip";
      const output = fs.createWriteStream(zipName);
      const archive = archiver("zip", { zlib: { level: 9 } });
      archive.pipe(output);
      images.forEach(img => archive.file(path.join(outputDir, img), { name: img }));
      await archive.finalize();
      output.on("close", () => {
        sendFileAndCleanup(res, zipName, filePath, originalName, to, images.map(i => path.join(outputDir, i)));
      });
      return;
    }

    //  Unsupported conversion/Conversión no soportada
    fs.unlinkSync(filePath);
    const errorMessage = encodeURIComponent("Conversión no soportada. / Conversion not supported.");
    return res.redirect(`/error.html?message=${errorMessage}`);
  } catch (err) {
    // Send the error to the error management middleware. / Pasar el error al middleware de manejo de errores
    next(err);
  }
});

// Run command as promise/Ejecutar comandos con promesas / 
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout || stderr);
    });
  });
}

// Handling 404 (not found) routes - this should be placed after all other defined routes./Manejo de rutas no encontradas (404) - debe ir después de todas las rutas definidas
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
});

// Handling server errors (500) - this should be placed at the very end./Manejo de errores de servidor (500) - debe ir al final de todo
app.use((error, req, res, next) => {
  console.error('💥 Error del servidor:', error);

  // Clean temporary files in case of error/Limpiar archivos temporales en caso de error
  if (req.file && fs.existsSync(req.file.path)) {
    fs.unlinkSync(req.file.path);
  }

  // Determine the type of error and redirect accordingly./Determinar el tipo de error y redirigir accordingly
  if (error.status === 404) {
    return res.status(404).sendFile(path.join(__dirname, "public", "404.html"));
  }

  // For other errors, use page 500./Para otros errores, usar la página 500
  const errorMessage = encodeURIComponent(error.message || 'Error interno del servidor');
  res.status(500).redirect(`/500.html?message=${errorMessage}`);
});

// Iniciar servidor / Start server
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
  console.log(`📁 Directorio actual: ${__dirname}`);
  console.log(`📄 Rutas disponibles:`);
  console.log(`   - http://localhost:${PORT}/ (Conversor principal)`);
  console.log(`   - http://localhost:${PORT}/test-error (Prueba de error)`);
  console.log(`   - http://localhost:${PORT}/test-500 (Prueba de error 500)`);
  console.log(`   - http://localhost:${PORT}/test-async-error (Prueba de error asíncrono)`);
  console.log(`   - http://localhost:${PORT}/ruta-inexistente (Prueba de 404)`);
});