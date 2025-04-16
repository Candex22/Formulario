// Variables globales
let successSound;
let equiposRegistrados = JSON.parse(localStorage.getItem('equiposLNR')) || [];
let registroActual = null;
let equiposContador = equiposRegistrados.length;

// Actualizar contador
document.getElementById('equiposCount').textContent = equiposContador;

// Referencias a elementos principales
const form = document.getElementById('registroForm');
const submitButton = document.getElementById('submitButton');
const resetButton = document.getElementById('resetButton');
const toast = document.getElementById('toast');

// Campos principales
const nombreEquipo = document.getElementById('nombreEquipo');
const institucion = document.getElementById('institucion');
const otroInstitucion = document.getElementById('otroInstitucion');
const emailResponsable = document.getElementById('emailResponsable');
const fotoEquipo = document.getElementById('fotoEquipo');
const fotoPreview = document.getElementById('fotoPreview');
const aceptoReglas = document.getElementById('aceptoReglas');
const disenoRobot = document.getElementById('disenoRobot');
const certificadoSeguridad = document.getElementById('certificadoSeguridad');
const categoriaCheckboxes = document.querySelectorAll('input[name="categorias"]');

// Elementos para ver registros
const verRegistrosBtn = document.getElementById('verRegistros');
const registrosOverlay = document.getElementById('registrosOverlay');
const closeRegistrosBtn = document.getElementById('closeRegistros');
const registrosBody = document.getElementById('registrosBody');
const registrosLoader = document.getElementById('registrosLoader');

// Inicializar validación de formulario
initFormValidation();
initRegistrosSystem();

// Inicializar audio (bonus)
initAudio();

// Función para inicializar el sistema de audio
function initAudio() {
    if (window.AudioContext || window.webkitAudioContext) {
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            
            // Crear un oscilador simple para el sonido de éxito
            function createSuccessSound() {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                
                osc.connect(gain);
                gain.connect(audioContext.destination);
                
                osc.type = "sine";
                osc.frequency.value = 587.33; // Nota Re
                
                gain.gain.value = 0.1;
                
                return {
                    play: function() {
                        const newOsc = audioContext.createOscillator();
                        const newGain = audioContext.createGain();
                        
                        newOsc.connect(newGain);
                        newGain.connect(audioContext.destination);
                        
                        newOsc.type = "sine";
                        newOsc.frequency.value = 587.33;
                        newGain.gain.value = 0.1;
                        
                        newOsc.start();
                        
                        // Cambia a una nota más alta después de 0.1 segundos
                        setTimeout(() => {
                            newOsc.frequency.value = 880; // Nota La
                        }, 100);
                        
                        // Detiene el sonido después de 0.3 segundos
                        setTimeout(() => {
                            newOsc.stop();
                        }, 300);
                    }
                };
            }
            
            successSound = createSuccessSound();
        } catch (e) {
            console.log("Audio no disponible:", e);
        }
    }
}

// Función para inicializar el sistema de registros
function initRegistrosSystem() {
    // Event listeners para ver registros
    verRegistrosBtn.addEventListener('click', showRegistros);
    closeRegistrosBtn.addEventListener('click', hideRegistros);
    
    // Cierra el overlay haciendo clic fuera del contenido
    registrosOverlay.addEventListener('click', function(e) {
        if (e.target === registrosOverlay) {
            hideRegistros();
        }
    });
}

// Funciones de inicialización para validación
function initFormValidation() {
    // Event listeners para validación en tiempo real
    nombreEquipo.addEventListener('input', validateNombreEquipo);
    institucion.addEventListener('change', validateInstitucion);
    emailResponsable.addEventListener('input', validateEmail);
    fotoEquipo.addEventListener('change', handleFotoUpload);
    disenoRobot.addEventListener('change', handleDisenoUpload);
    certificadoSeguridad.addEventListener('change', handleCertificadoUpload);
    aceptoReglas.addEventListener('change', validateForm);
    
    // Event listeners para categorías
    categoriaCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            validateCategorias();
            checkSumoCertificadoRequirement();
            validateForm();
        });
    });
    
    // Institution "Otro" toggle
    institucion.addEventListener('change', function() {
        if (this.value === 'otro') {
            otroInstitucion.classList.remove('hidden');
            document.getElementById('otraInstitucion').required = true;
        } else {
            otroInstitucion.classList.add('hidden');
            document.getElementById('otraInstitucion').required = false;
        }
    });
    
    // Submit handler
    form.addEventListener('submit', handleSubmit);
    
    // Reset handler
    resetButton.addEventListener('click', resetForm);
    
    // Initial validation
    validateForm();
}

// Validación de campos individuales
function validateNombreEquipo() {
    const input = nombreEquipo;
    const error = document.getElementById('nombreEquipo-error');
    const successIcon = input.parentElement.querySelector('.success-icon');
    const errorIcon = input.parentElement.querySelector('.error-icon');
    
    if (input.value.trim() === '' || input.value.length > 30) {
        input.classList.add('error');
        error.style.display = 'block';
        successIcon.style.display = 'none';
        errorIcon.style.display = 'inline-block';
        return false;
    } else {
        input.classList.remove('error');
        error.style.display = 'none';
        successIcon.style.display = 'inline-block';
        errorIcon.style.display = 'none';
        return true;
    }
}

function validateInstitucion() {
    const input = institucion;
    const otraInput = document.getElementById('otraInstitucion');
    const error = document.getElementById('institucion-error');
    const successIcon = input.parentElement.querySelector('.success-icon');
    const errorIcon = input.parentElement.querySelector('.error-icon');
    
    if (input.value === '') {
        input.classList.add('error');
        error.style.display = 'block';
        successIcon.style.display = 'none';
        errorIcon.style.display = 'inline-block';
        return false;
    } else if (input.value === 'otro' && otraInput.value.trim() === '') {
        input.classList.add('error');
        error.style.display = 'block';
        successIcon.style.display = 'none';
        errorIcon.style.display = 'inline-block';
        return false;
    } else {
        input.classList.remove('error');
        error.style.display = 'none';
        successIcon.style.display = 'inline-block';
        errorIcon.style.display = 'none';
        return true;
    }
}

function validateEmail() {
    const input = emailResponsable;
    const error = document.getElementById('emailResponsable-error');
    const successIcon = input.parentElement.querySelector('.success-icon');
    const errorIcon = input.parentElement.querySelector('.error-icon');
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(input.value)) {
        input.classList.add('error');
        error.style.display = 'block';
        successIcon.style.display = 'none';
        errorIcon.style.display = 'inline-block';
        return false;
    } else {
        input.classList.remove('error');
        error.style.display = 'none';
        successIcon.style.display = 'inline-block';
        errorIcon.style.display = 'none';
        return true;
    }
}

function validateCategorias() {
    const error = document.getElementById('categorias-error');
    let isValid = false;
    
    // Verificar si al menos una categoría está seleccionada
    categoriaCheckboxes.forEach(checkbox => {
        if (checkbox.checked) {
            isValid = true;
        }
    });
    
    error.style.display = isValid ? 'none' : 'block';
    return isValid;
}

function checkSumoCertificadoRequirement() {
    const categoriaSumo = document.getElementById('categoriaSumo');
    const categoriaMinisumo = document.getElementById('categoriaMinisumo');
    const certificadoContainer = document.getElementById('certificadoSeguridad-container');
    const certificadoError = document.getElementById('certificadoSeguridad-error');
    
    // Si alguna de las categorías de sumo está seleccionada, se requiere certificado
    if (categoriaSumo.checked || categoriaMinisumo.checked) {
        certificadoSeguridad.required = true;
        certificadoContainer.classList.add('required');
        certificadoError.textContent = 'El certificado de seguridad es obligatorio para las categorías Sumo y Minisumo.';
    } else {
        certificadoSeguridad.required = false;
        certificadoContainer.classList.remove('required');
        certificadoError.textContent = '';
    }
}

function handleFotoUpload(e) {
    const input = fotoEquipo;
    const error = document.getElementById('fotoEquipo-error');
    const file = input.files[0];
    
    if (!file) {
        error.style.display = 'block';
        fotoPreview.style.display = 'none';
        return false;
    }
    
    // Validar tipo y tamaño
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
        error.textContent = 'El archivo debe ser JPG o PNG.';
        error.style.display = 'block';
        fotoPreview.style.display = 'none';
        return false;
    }
    
    if (file.size > maxSize) {
        error.textContent = 'El tamaño máximo es 2MB.';
        error.style.display = 'block';
        fotoPreview.style.display = 'none';
        return false;
    }
    
    // Mostrar vista previa
    const reader = new FileReader();
    reader.onload = function(e) {
        fotoPreview.src = e.target.result;
        fotoPreview.style.display = 'block';
    }
    reader.readAsDataURL(file);
    
    error.style.display = 'none';
    return true;
}

function handleDisenoUpload(e) {
    const input = disenoRobot;
    const error = document.getElementById('disenoRobot-error');
    const previewContainer = document.getElementById('disenoPreview');
    const file = input.files[0];
    
    if (!file) {
        error.style.display = 'block';
        previewContainer.innerHTML = '';
        return false;
    }
    
    // Validar tipo y tamaño
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!validTypes.includes(file.type)) {
        error.textContent = 'El archivo debe ser PDF, JPG o PNG.';
        error.style.display = 'block';
        previewContainer.innerHTML = '';
        return false;
    }
    
    if (file.size > maxSize) {
        error.textContent = 'El tamaño máximo es 5MB.';
        error.style.display = 'block';
        previewContainer.innerHTML = '';
        return false;
    }
    
    // Mostrar vista previa o información del archivo
    previewContainer.innerHTML = '';
    
    if (file.type === 'application/pdf') {
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        fileInfo.innerHTML = `<i class="fas fa-file-pdf"></i> ${file.name} (${formatFileSize(file.size)})`;
        previewContainer.appendChild(fileInfo);
    } else {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'file-thumbnail';
            previewContainer.appendChild(img);
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
            previewContainer.appendChild(fileInfo);
        }
        reader.readAsDataURL(file);
    }
    
    error.style.display = 'none';
    return true;
}

function handleCertificadoUpload(e) {
    const input = certificadoSeguridad;
    const error = document.getElementById('certificadoSeguridad-error');
    const previewContainer = document.getElementById('certificadoPreview');
    const file = input.files[0];
    
    // Si el certificado no es obligatorio y no hay archivo, no mostrar error
    if (!input.required && !file) {
        error.style.display = 'none';
        previewContainer.innerHTML = '';
        return true;
    }
    
    if (input.required && !file) {
        error.style.display = 'block';
        previewContainer.innerHTML = '';
        return false;
    }
    
    // Validar tipo y tamaño
    const validTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSize = 2 * 1024 * 1024; // 2MB
    
    if (!validTypes.includes(file.type)) {
        error.textContent = 'El archivo debe ser PDF, JPG o PNG.';
        error.style.display = 'block';
        previewContainer.innerHTML = '';
        return false;
    }
    
    if (file.size > maxSize) {
        error.textContent = 'El tamaño máximo es 2MB.';
        error.style.display = 'block';
        previewContainer.innerHTML = '';
        return false;
    }
    
    // Mostrar vista previa o información del archivo
    previewContainer.innerHTML = '';
    
    if (file.type === 'application/pdf') {
        const fileInfo = document.createElement('div');
        fileInfo.className = 'file-info';
        fileInfo.innerHTML = `<i class="fas fa-file-pdf"></i> ${file.name} (${formatFileSize(file.size)})`;
        previewContainer.appendChild(fileInfo);
    } else {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = document.createElement('img');
            img.src = e.target.result;
            img.className = 'file-thumbnail';
            previewContainer.appendChild(img);
            
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.textContent = `${file.name} (${formatFileSize(file.size)})`;
            previewContainer.appendChild(fileInfo);
        }
        reader.readAsDataURL(file);
    }
    
    error.style.display = 'none';
    return true;
}

// Función auxiliar para formatear tamaño de archivo
function formatFileSize(bytes) {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
}

// Validación global del formulario
function validateForm() {
    const isNombreValid = validateNombreEquipo();
    const isInstitucionValid = validateInstitucion();
    const isEmailValid = validateEmail();
    const isFotoValid = fotoEquipo.files.length > 0;
    const isCategoriasValid = validateCategorias();
    const isDisenoValid = disenoRobot.files.length > 0;
    
    // Comprobar certificado solo si es requerido
    let isCertificadoValid = true;
    if (certificadoSeguridad.required) {
        isCertificadoValid = certificadoSeguridad.files.length > 0;
    }
    
    const isTermsAccepted = aceptoReglas.checked;
    
    // Habilitar/deshabilitar botón de envío
    submitButton.disabled = !(
        isNombreValid && 
        isInstitucionValid && 
        isEmailValid && 
        isFotoValid && 
        isCategoriasValid && 
        isDisenoValid && 
        isCertificadoValid && 
        isTermsAccepted
    );
    
    return !submitButton.disabled;
}

// Manejo de envío del formulario
function handleSubmit(e) {
    e.preventDefault();
    
    if (!validateForm()) {
        showToast('Por favor, complete todos los campos requeridos.', 'error');
        return;
    }
    
    // Simular carga
    submitButton.disabled = true;
    submitButton.innerHTML = '<div class="loader"></div> Registrando...';
    
    setTimeout(() => {
        // Recolectar datos del formulario
        const categorias = [];
        categoriaCheckboxes.forEach(checkbox => {
            if (checkbox.checked) {
                categorias.push(checkbox.value);
            }
        });
        
        const institucionValue = institucion.value === 'otro' 
            ? document.getElementById('otraInstitucion').value 
            : institucion.options[institucion.selectedIndex].text;
        
        // Crear objeto de registro
        const nuevoRegistro = {
            id: Date.now().toString(),
            nombreEquipo: nombreEquipo.value,
            institucion: institucionValue,
            email: emailResponsable.value,
            categorias: categorias,
            timestamp: new Date().toISOString()
        };
        
        // Guardar registro
        equiposRegistrados.push(nuevoRegistro);
        localStorage.setItem('equiposLNR', JSON.stringify(equiposRegistrados));
        
        // Actualizar contador
        equiposContador++;
        document.getElementById('equiposCount').textContent = equiposContador;
        
        // Reiniciar formulario y mostrar mensaje de éxito
        resetForm();
        showToast('¡Equipo registrado exitosamente!', 'success');
        
        // Reproducir sonido de éxito si está disponible
        if (successSound) {
            successSound.play();
        }
        
        // Resetear estado del botón
        submitButton.disabled = false;
        submitButton.innerHTML = '<i class="fas fa-robot"></i> Registrar Equipo';
    }, 1500);
}

// Función para resetear el formulario
function resetForm() {
    form.reset();
    
    // Limpiar vistas previas
    fotoPreview.style.display = 'none';
    document.getElementById('disenoPreview').innerHTML = '';
    document.getElementById('certificadoPreview').innerHTML = '';
    
    // Ocultar campo de otra institución
    otroInstitucion.classList.add('hidden');
    
    // Resetear validaciones
    const errorMessages = document.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.style.display = 'none');
    
    const successIcons = document.querySelectorAll('.success-icon');
    successIcons.forEach(icon => icon.style.display = 'none');
    
    const errorIcons = document.querySelectorAll('.error-icon');
    errorIcons.forEach(icon => icon.style.display = 'none');
    
    // Deshabilitar botón de envío
    submitButton.disabled = true;
}

// Mostrar/ocultar registros
function showRegistros() {
    registrosOverlay.style.display = 'flex';
    registrosLoader.style.display = 'block';
    
    // Simular carga de datos
    setTimeout(() => {
        registrosLoader.style.display = 'none';
        cargarTablaRegistros();
    }, 800);
}

function hideRegistros() {
    registrosOverlay.style.display = 'none';
}

// Cargar tabla de registros
function cargarTablaRegistros() {
    registrosBody.innerHTML = '';
    
    if (equiposRegistrados.length === 0) {
        registrosBody.innerHTML = '<tr><td colspan="5" style="text-align: center;">No hay equipos registrados</td></tr>';
        return;
    }
    
    equiposRegistrados.forEach(equipo => {
        const tr = document.createElement('tr');
        
        // Columna de equipo
        const tdEquipo = document.createElement('td');
        tdEquipo.textContent = equipo.nombreEquipo;
        tr.appendChild(tdEquipo);
        
        // Columna de institución
        const tdInstitucion = document.createElement('td');
        tdInstitucion.textContent = equipo.institucion;
        tr.appendChild(tdInstitucion);
        
        // Email
        const tdEmail = document.createElement('td');
        tdEmail.textContent = equipo.email;
        tr.appendChild(tdEmail);
        
        // Categorías
        const tdCategorias = document.createElement('td');
        equipo.categorias.forEach(cat => {
            const badge = document.createElement('span');
            badge.className = 'badge';
            badge.textContent = cat.charAt(0).toUpperCase() + cat.slice(1);
            tdCategorias.appendChild(badge);
        });
        tr.appendChild(tdCategorias);
        
        // Acciones
        const tdAcciones = document.createElement('td');
        
        const editBtn = document.createElement('button');
        editBtn.className = 'actions-btn';
        editBtn.innerHTML = '<i class="fas fa-edit"></i>';
        editBtn.title = 'Editar';
        editBtn.onclick = () => editarRegistro(equipo.id);
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'actions-btn delete-btn';
        deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
        deleteBtn.title = 'Eliminar';
        deleteBtn.onclick = () => eliminarRegistro(equipo.id);
        
        tdAcciones.appendChild(editBtn);
        tdAcciones.appendChild(deleteBtn);
        tr.appendChild(tdAcciones);
        
        registrosBody.appendChild(tr);
    });
}

// Editar registro
function editarRegistro(id) {
    // Encontrar el registro
    const equipo = equiposRegistrados.find(eq => eq.id === id);
    if (!equipo) return;
    
    // TODO: Implementar funcionalidad de edición
    showToast('Función de edición en desarrollo', 'info');
    
    // Cerrar vista de registros
    hideRegistros();
}

// Eliminar registro
function eliminarRegistro(id) {
    if (confirm('¿Estás seguro de eliminar este equipo?')) {
        equiposRegistrados = equiposRegistrados.filter(eq => eq.id !== id);
        localStorage.setItem('equiposLNR', JSON.stringify(equiposRegistrados));
        
        // Actualizar contador
        equiposContador = equiposRegistrados.length;
        document.getElementById('equiposCount').textContent = equiposContador;
        
        // Recargar tabla
        cargarTablaRegistros();
        
        showToast('Equipo eliminado correctamente', 'success');
    }
}

// Mostrar toast notification
function showToast(message, type = 'info') {
    toast.textContent = message;
    toast.className = 'toast show';
    
    // Agregar clase de color según el tipo
    if (type === 'error') {
        toast.style.backgroundColor = 'rgba(255, 62, 62, 0.9)';
        toast.style.boxShadow = '0 0 20px rgba(255, 62, 62, 0.5)';
    } else if (type === 'success') {
        toast.style.backgroundColor = 'rgba(0, 240, 255, 0.9)';
        toast.style.boxShadow = '0 0 20px rgba(0, 240, 255, 0.5)';
    } else if (type === 'info') {
        toast.style.backgroundColor = 'rgba(0, 162, 255, 0.9)';
        toast.style.boxShadow = '0 0 20px rgba(0, 162, 255, 0.5)';
    }
    
    setTimeout(() => {
        toast.className = 'toast';
    }, 3000);
}