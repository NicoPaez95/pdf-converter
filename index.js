// Módulos requeridos / Required modules
const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const { PDFDocument } = require("pdf-lib");
const archiver = require("archiver");

const app = express();
const PORT = 3000;

// Crear carpetas si no existen / Create directories if not exist
const uploadDir = path.join(__dirname, "uploads");
const outputDir = path.join(__dirname, "outputs");
[uploadDir, outputDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

// Configuración de almacenamiento con Multer / Multer storage setup
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const name = Date.now().toString(16) + path.extname(file.originalname);
    cb(null, name);
  }
});
const upload = multer({ storage });

// Archivos estáticos desde la carpeta public / Serve static files from "public"
app.use(express.static("public"));

// Ruta principal de conversión / Main conversion route
app.post("/convert", upload.single("file"), async (req, res) => {
  if (!req.file) return res.status(400).send("No se subió ningún archivo. / No file uploaded.");

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
    // Word → PDF
    if (from === "word" && to === "pdf") {
      const cmd = `"${soffice}" --headless --convert-to pdf "${filePath}" --outdir "${outputDir}"`;
      await execPromise(cmd);
      const pdfPath = path.join(outputDir, path.basename(filePath, ext) + ".pdf");
      if (!fs.existsSync(pdfPath)) throw new Error("No se generó el PDF. / PDF was not generated.");
      return sendFileAndCleanup(res, pdfPath, filePath);
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
      return sendFileAndCleanup(res, outputPath, filePath);
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
        sendFileAndCleanup(res, zipName, filePath, images.map(i => path.join(outputDir, i)));
      });
      return;
    }

    // PDF → Word
    if (from === "pdf" && to === "word") {
      const cmd = `"${soffice}" --headless --convert-to docx "${filePath}" --outdir "${outputDir}"`;
      const result = await execPromise(cmd);
      console.log("📝 Ejecutado / Executed:", cmd);
      console.log("🧾 Salida / Output:", result);

      const files = fs.readdirSync(outputDir);
      console.log("📂 Archivos en outputDir / Files in outputDir:", files);

      const baseName = path.basename(filePath);
      const docxFile = files.find(f => f.startsWith(baseName) && f.endsWith(".docx"));

      if (!docxFile) throw new Error("No se generó el DOCX. / DOCX was not generated.");

      const docxPath = path.join(outputDir, docxFile);
      return sendFileAndCleanup(res, docxPath, filePath);
    }

    // Conversión no soportada / Unsupported conversion
    fs.unlinkSync(filePath);
    return res.status(400).send("Conversión no soportada. / Conversion not supported.");
  } catch (err) {
    console.error("❌ Error:", err.message);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    return res.status(500).send("Error al convertir archivo: " + err.message);
  }
});

// Ejecutar comandos con promesas / Run command as promise
function execPromise(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) return reject(err);
      resolve(stdout || stderr);
    });
  });
}

// Enviar archivo y limpiar / Send file and clean up
function sendFileAndCleanup(res, outputPath, inputPath, extraPaths = []) {
  res.download(outputPath, err => {
    if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
    if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    extraPaths.forEach(p => fs.existsSync(p) && fs.unlinkSync(p));
    if (err) console.error("❌ Error al enviar archivo / Error sending file:", err);
  });
}

// Iniciar servidor / Start server
app.listen(PORT, () => {
  console.log(`✅ Servidor escuchando en http://localhost:${PORT}`);
});
