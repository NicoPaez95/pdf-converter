const { exec } = require('child_process');

exec('"C:\\Program Files\\LibreOffice\\program\\soffice.exe" --version', (err, stdout, stderr) => {
  if (err) {
    console.error('❌ LibreOffice no se pudo ejecutar:', stderr || err.message);
  } else {
    console.log('✅ LibreOffice responde correctamente:\n', stdout);
  }
});
