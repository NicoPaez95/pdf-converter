 // Script principal / Main script -->

    const from = document.getElementById('fromFormat');
    const to = document.getElementById('toFormat');
    const swapBtn = document.getElementById('swap');
    const fileInput = document.getElementById('fileInput');
    const submitBtn = document.getElementById('submitBtn');
    const message = document.getElementById('message');

    // Definición de conversiones válidas / Valid conversion map
    const validConversions = {
      word: ['pdf'],
      image: ['pdf'],
      pdf: ['image', 'word']
    };

    // Actualiza las opciones disponibles en el segundo select / Update "to" options
    function actualizarOpcionesTo() {
      const fromVal = from.value;
      for (let option of to.options) option.disabled = true;
      validConversions[fromVal].forEach(valid => {
        for (let option of to.options) {
          if (option.value === valid) option.disabled = false;
        }
      });
      if (to.options[to.selectedIndex].disabled) {
        for (let option of to.options) {
          if (!option.disabled) {
            to.value = option.value;
            break;
          }
        }
      }
    }

    // Cambia el atributo accept del input según el formato origen / Adjust accept attribute
    function actualizarAcceptFile() {
      const fromVal = from.value;
      let accept = '';
      if (fromVal === 'word') accept = '.doc,.docx';
      else if (fromVal === 'image') accept = '.png,.jpg,.jpeg,.gif,.bmp,.webp';
      else if (fromVal === 'pdf') accept = '.pdf';
      fileInput.setAttribute('accept', accept);
    }

    // Verifica si el archivo seleccionado es válido / Validate selected file
    function validarArchivo() {
      message.textContent = '';
      const file = fileInput.files[0];
      if (!file) return true;
      const fromVal = from.value;
      const ext = file.name.split('.').pop().toLowerCase();
      const allowedExt = {
        word: ['doc', 'docx'],
        image: ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp'],
        pdf: ['pdf']
      };
      if (!allowedExt[fromVal].includes(ext)) {
        message.textContent = 'Archivo inválido para el formato seleccionado.';
        submitBtn.disabled = true;
        return false;
      }
      submitBtn.disabled = false;
      return true;
    }

    // Intercambia los formatos / Swap formats
    swapBtn.addEventListener('click', () => {
      const temp = from.value;
      from.value = to.value;
      to.value = temp;
      actualizarOpcionesTo();
      actualizarAcceptFile();
      validarArchivo();
    });

    from.addEventListener('change', () => {
      actualizarOpcionesTo();
      actualizarAcceptFile();
      validarArchivo();
    });

    to.addEventListener('change', validarArchivo);
    fileInput.addEventListener('change', validarArchivo);

    // Inicialización / Initial setup
    actualizarOpcionesTo();
    actualizarAcceptFile();
 