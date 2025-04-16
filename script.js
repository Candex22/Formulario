
document.addEventListener('DOMContentLoaded', function () {
    // Cambio de tema claro/oscuro
    const themeToggleBtn = document.getElementById('themeToggle');
    const body = document.body;

    themeToggleBtn.addEventListener('click', function () {
        if (body.classList.contains('dark-mode')) {
            body.classList.remove('dark-mode');
            body.classList.add('light-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-moon"></i>';
        } else {
            body.classList.remove('light-mode');
            body.classList.add('dark-mode');
            themeToggleBtn.innerHTML = '<i class="fas fa-sun"></i>';
        }
    });

    // Slider de experiencia
    const experienciaSlider = document.getElementById('experiencia');
    const experienciaValor = document.getElementById('experienciaValor');

    experienciaSlider.addEventListener('input', function () {
        experienciaValor.textContent = this.value + ' años';
    });

    // Vista previa de logo
    const logoInput = document.getElementById('logoEquipo');
    const logoPreview = document.getElementById('logoPreview');

    logoInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = function (e) {
                logoPreview.src = e.target.result;
                logoPreview.style.display = 'block';
            }

            reader.readAsDataURL(this.files[0]);
        }
    });

    // Selección de plataformas
    const platformButtons = document.querySelectorAll('.platform-btn');
    const plataformasInput = document.getElementById('plataformasSeleccionadas');
    const plataformasSeleccionadas = new Set();

    platformButtons.forEach(button => {
        button.addEventListener('click', function () {
            const platform = this.dataset.platform;

            if (this.classList.contains('active')) {
                this.classList.remove('active');
                plataformasSeleccionadas.delete(platform);
            } else {
                this.classList.add('active');
                plataformasSeleccionadas.add(platform);
            }

            plataformasInput.value = Array.from(plataformasSeleccionadas).join(',');
        });
    });

    // Vista previa de portafolio
    const portfolioInput = document.getElementById('portfolioDemo');
    const portfolioPreview = document.getElementById('portfolioPreview');

    portfolioInput.addEventListener('change', function () {
        if (this.files && this.files[0]) {
            const file = this.files[0];

            // Crear elemento de información de archivo
            const fileInfo = document.createElement('div');
            fileInfo.className = 'file-info';
            fileInfo.innerHTML = `
                    <p><strong>${file.name}</strong></p>
                    <p>Tamaño: ${(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                    <p>Tipo: ${file.type || 'application/zip'}</p>
                `;

            // Limpiar vista previa anterior
            portfolioPreview.innerHTML = '';
            portfolioPreview.appendChild(fileInfo);
        }
    });

    // Contador de tiempo restante
    const countDownDate = new Date("June 15, 2025 18:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const dias = Math.floor(distance / (1000 * 60 * 60 * 24));
        const horas = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutos = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const segundos = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById("dias").innerText = dias;
        document.getElementById("horas").innerText = horas;
        document.getElementById("minutos").innerText = minutos;
        document.getElementById("segundos").innerText = segundos;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();

    // Validación de formulario
    const form = document.getElementById('registroForm');
    const nombreEquipoInput = document.getElementById('nombreEquipo');
    const nombreLiderInput = document.getElementById('nombreLider');
    const emailContactoInput = document.getElementById('emailContacto');
    const descripcionJuegoInput = document.getElementById('descripcionJuego');

    // Función para validar email
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Validación en tiempo real para nombre de equipo
    nombreEquipoInput.addEventListener('input', function () {
        const errorElement = document.getElementById('nombreEquipo-error');
        const successIcon = this.nextElementSibling;
        const errorIcon = successIcon.nextElementSibling;

        if (this.value.trim() === '' || this.value.length > 30) {
            this.classList.add('error');
            errorElement.style.display = 'block';
            successIcon.style.display = 'none';
            errorIcon.style.display = 'inline';
        } else {
            this.classList.remove('error');
            errorElement.style.display = 'none';
            successIcon.style.display = 'inline';
            errorIcon.style.display = 'none';
        }
    });

    // Validación en tiempo real para nombre del líder
    nombreLiderInput.addEventListener('input', function () {
        const errorElement = document.getElementById('nombreLider-error');
        const successIcon = this.nextElementSibling;
        const errorIcon = successIcon.nextElementSibling;

        if (this.value.trim() === '') {
            this.classList.add('error');
            errorElement.style.display = 'block';
            successIcon.style.display = 'none';
            errorIcon.style.display = 'inline';
        } else {
            this.classList.remove('error');
            errorElement.style.display = 'none';
            successIcon.style.display = 'inline';
            errorIcon.style.display = 'none';
        }
    });

    // Validación en tiempo real para email
    emailContactoInput.addEventListener('input', function () {
        const errorElement = document.getElementById('emailContacto-error');
        const successIcon = this.nextElementSibling;
        const errorIcon = successIcon.nextElementSibling;

        if (!isValidEmail(this.value)) {
            this.classList.add('error');
            errorElement.style.display = 'block';
            successIcon.style.display = 'none';
            errorIcon.style.display = 'inline';
        } else {
            this.classList.remove('error');
            errorElement.style.display = 'none';
            successIcon.style.display = 'inline';
            errorIcon.style.display = 'none';
        }
    });

    // Envío del formulario
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        // Verificar si se ha seleccionado al menos una categoría
        const categoriasSeleccionadas = document.querySelectorAll('input[name="categorias"]:checked');
        if (categoriasSeleccionadas.length === 0) {
            document.getElementById('categories').scrollIntoView();
            showToast('Debes seleccionar al menos una categoría de juego');
            return;
        }

        // Verificar si se ha seleccionado al menos una plataforma
        if (plataformasInput.value === '') {
            document.getElementById('technical').scrollIntoView();
            showToast('Debes seleccionar al menos una plataforma objetivo');
            return;
        }

        // Mostrar loader
        document.getElementById('submitLoader').style.display = 'block';
        document.getElementById('submitBtn').disabled = true;

        // Simulación de envío (en un caso real, aquí iría la lógica de envío al servidor)
        setTimeout(function () {
            // Ocultar loader
            document.getElementById('submitLoader').style.display = 'none';
            document.getElementById('submitBtn').disabled = false;

            // Guardar en localStorage
            saveRegistration();

            // Mostrar mensaje de éxito
            showToast('¡Registro completado con éxito! Te esperamos en la Game Jam');

            // Actualizar contador de participantes
            updateParticipantCounter();

            // Resetear formulario
            form.reset();
            logoPreview.style.display = 'none';
            portfolioPreview.innerHTML = '';

            // Desactivar todos los botones de plataforma
            platformButtons.forEach(button => {
                button.classList.remove('active');
            });
            plataformasSeleccionadas.clear();
            plataformasInput.value = '';

        }, 2000);
    });

    // Función para guardar registro en localStorage
    function saveRegistration() {
        // Obtener registros existentes
        let registros = JSON.parse(localStorage.getItem('pixelForgeRegistros')) || [];

        // Obtener valores del formulario
        const nombreEquipo = document.getElementById('nombreEquipo').value;
        const categorias = Array.from(document.querySelectorAll('input[name="categorias"]:checked')).map(el => el.value);
        const plataformas = plataformasInput.value.split(',');
        const tamanoEquipo = document.getElementById('tamanoEquipo').value;

        // Crear nuevo registro
        const nuevoRegistro = {
            id: Date.now(), // ID único basado en timestamp
            nombreEquipo: nombreEquipo,
            categorias: categorias,
            plataformas: plataformas,
            tamanoEquipo: tamanoEquipo,
            fechaRegistro: new Date().toISOString()
        };

        // Añadir a la lista
        registros.push(nuevoRegistro);

        // Guardar en localStorage
        localStorage.setItem('pixelForgeRegistros', JSON.stringify(registros));

        // Actualizar tabla si está visible
        if (document.getElementById('registrosOverlay').style.display === 'flex') {
            loadRegistrations();
        }
    }

    // Cargar registros guardados
    function loadRegistrations() {
        const tableBody = document.querySelector('#registrosTable tbody');
        tableBody.innerHTML = '';

        // Obtener registros
        let registros = JSON.parse(localStorage.getItem('pixelForgeRegistros')) || [];

        if (registros.length === 0) {
            const row = document.createElement('tr');
            row.innerHTML = '<td colspan="5" style="text-align: center;">No hay equipos registrados aún</td>';
            tableBody.appendChild(row);
            return;
        }

        // Mapeo de valores de tamaño de equipo a texto
        const tamanoEquipoMap = {
            'solo': '1 persona',
            'pequeno': '2-3 personas',
            'mediano': '4-6 personas',
            'grande': '7+ personas'
        };

        // Crear filas
        registros.forEach(registro => {
            const row = document.createElement('tr');

            // Categorías como badges
            const categoriasBadges = registro.categorias.map(cat =>
                `<span class="badge">${cat}</span>`
            ).join(' ');

            // Plataformas como badges
            const plataformasBadges = registro.plataformas.map(plat =>
                `<span class="badge">${plat}</span>`
            ).join(' ');

            row.innerHTML = `
                    <td>${registro.nombreEquipo}</td>
                    <td>${categoriasBadges}</td>
                    <td>${plataformasBadges}</td>
                    <td>${tamanoEquipoMap[registro.tamanoEquipo] || registro.tamanoEquipo}</td>
                    <td>
                        <button class="actions-btn view-btn" data-id="${registro.id}"><i class="fas fa-eye"></i></button>
                        <button class="actions-btn delete-btn" data-id="${registro.id}"><i class="fas fa-trash"></i></button>
                    </td>
                `;

            tableBody.appendChild(row);
        });

        // Eventos para botones de acciones
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const registroId = parseInt(this.dataset.id);
                deleteRegistration(registroId);
            });
        });

        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function () {
                const registroId = parseInt(this.dataset.id);
                viewRegistration(registroId);
            });
        });
    }

    // Eliminar registro
    function deleteRegistration(id) {
        if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
            // Obtener registros
            let registros = JSON.parse(localStorage.getItem('pixelForgeRegistros')) || [];

            // Filtrar para eliminar el registro
            registros = registros.filter(reg => reg.id !== id);

            // Guardar en localStorage
            localStorage.setItem('pixelForgeRegistros', JSON.stringify(registros));

            // Recargar tabla
            loadRegistrations();

            // Actualizar contador
            updateParticipantCounter();

            // Mostrar mensaje
            showToast('Registro eliminado correctamente');
        }
    }

    // Ver detalles de registro (simulado)
    function viewRegistration(id) {
        // Obtener registros
        let registros = JSON.parse(localStorage.getItem('pixelForgeRegistros')) || [];

        // Encontrar el registro
        const registro = registros.find(reg => reg.id === id);

        if (registro) {
            showToast(`Detalles del equipo: ${registro.nombreEquipo}`);
            // Aquí podría mostrarse un modal con más detalles
        }
    }

    // Actualizar contador de participantes
    function updateParticipantCounter() {
        const registros = JSON.parse(localStorage.getItem('pixelForgeRegistros')) || [];
        document.getElementById('totalParticipantes').innerText = registros.length + 32; // Base ficticia + registros reales
    }

    // Cargar contador inicial
    updateParticipantCounter();

    // Mostrar/ocultar overlay de registros
    document.getElementById('participantesCounter').addEventListener('click', function () {
        document.getElementById('registrosOverlay').style.display = 'flex';
        loadRegistrations();
    });

    document.getElementById('closeRegistrosBtn').addEventListener('click', function () {
        document.getElementById('registrosOverlay').style.display = 'none';
    });

    // Función para mostrar toast
    function showToast(message) {
        const toast = document.getElementById('toastNotification');
        toast.textContent = message;
        toast.classList.add('show');

        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Navegación suave al hacer clic en enlaces de navegación
    document.querySelectorAll('nav a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            window.scrollTo({
                top: targetElement.offsetTop - 100,
                behavior: 'smooth'
            });
        });
    });
});