const loginForm = document.getElementById('loginForm');
const alertDiv = document.getElementById('alert');
const successMessage = document.getElementById('successMessage');
const registrationForm = document.getElementById('registrationFormSupervisor');
const chartsViewGerente = document.getElementById('chartsViewGerente');

loginForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    try {
        const response = await authenticateUser(username, password);
        
        if (response.success) {
            showAlert('success', response.message);
            loginForm.classList.add('hidden');

            if (response.role === 'supervisor') {
                registrationForm.classList.remove('hidden');
                // Cargar la fecha y hora actual en el campo de Fecha Proceso
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
                const day = ('0' + currentDate.getDate()).slice(-2);
                const hours = ('0' + currentDate.getHours()).slice(-2);
                const minutes = ('0' + currentDate.getMinutes()).slice(-2);
                const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
                document.getElementById('fechaProceso').value = formattedDate;
            } else if (response.role === 'gerente') {
                chartsViewGerente.classList.remove('hidden');
                showCharts();
            }
        } else {
            showAlert('error', response.message);
        }
    } catch (error) {
        console.error('Error:', error);
        showAlert('error', 'Error de conexión al cargar datos de usuario');
    }
});

async function authenticateUser(username, password) {
    try {
        // Cargar datos de usuarios desde el archivo JSON local
        const response = await fetch('user.json');
        const users = await response.json();

        // Buscar usuario en la lista
        const user = users.find(user => user.username === username && user.password === password);

        if (user) {
            return { success: true, message: '¡Acceso exitoso!', role: user.role };
        } else {
            return { success: false, message: 'Usuario o contraseña incorrectos' };
        }
    } catch (error) {
        throw new Error('Error al cargar datos de usuario');
    }
}

function showCharts() {
    // Lógica para mostrar los gráficos
}

function showAlert(type, message) {
    alertDiv.textContent = message;
    alertDiv.classList.remove('hidden');
    alertDiv.classList.add(type);
    setTimeout(() => {
        alertDiv.textContent = '';
        alertDiv.classList.add('hidden');
        alertDiv.classList.remove(type);
    }, 3000);
}

function showSuccessMessage(message) {
    successMessage.textContent = message;
    successMessage.classList.remove('hidden');
}

document.addEventListener('DOMContentLoaded', async function() {
    const personFormsContainer = document.getElementById('personForms');
    const prevButton = document.getElementById('prevButton');
    const nextButton = document.getElementById('nextButton');
    const submitButton = document.getElementById('submitButtonSupervisor');
    const formData = new Array(5).fill({}); // Array para almacenar los datos de cada formulario
    let currentPersonIndex = 0;
    
    async function createPersonForm(index) {
        // Limpiar el contenedor de formularios de persona antes de agregar uno nuevo
        personFormsContainer.innerHTML = '';
    
        const personForm = document.createElement('div');
        personForm.classList.add('personForm', 'container-fluid', 'mt-4', 'border', 'p-4', 'rounded'); // Cambiar a container-fluid para ocupar todo el ancho
        personFormsContainer.appendChild(personForm);
    
        const personInfo = document.createElement('div');
        personInfo.classList.add('row', 'mb-4', 'align-items-center'); // Agregar align-items-center para alinear verticalmente en todas las resoluciones
        personForm.appendChild(personInfo);
    
        // Obtener los datos de los empleados desde el archivo JSON
        const response = await fetch('employers.json');
        const employees = await response.json();
        const employee = employees[index];
    
        // Crear elementos para mostrar la información del empleado
        const imageContainer = document.createElement('div');
        imageContainer.classList.add('col-md-4', 'text-center', 'mb-3'); // Agregar clases de Bootstrap para columnas y centrado
        personInfo.appendChild(imageContainer);
    
        const image = document.createElement('img');
        image.classList.add('img-fluid', 'rounded-circle'); // Agregar clases de Bootstrap para hacer la imagen redondeada y responsiva
        image.src = `src/images/${employee.image}`;
        image.alt = employee.name;
        imageContainer.appendChild(image);
    
        const textContainer = document.createElement('div');
        textContainer.classList.add('col-md-8', 'mb-3'); // Agregar clase de Bootstrap para columnas
        personInfo.appendChild(textContainer);
    
        const name = document.createElement('h4');
        name.classList.add('mb-2', 'text-center', 'mb-md-0'); // Agregar clases de Bootstrap para texto centrado
        name.textContent = employee.name;
        textContainer.appendChild(name);
    
        const position = document.createElement('p');
        position.classList.add('lead', 'mb-0', 'text-center'); // Agregar clases de Bootstrap para texto centrado
        position.textContent = employee.position;
        textContainer.appendChild(position);
    
        // Crear los campos de indicadores para la persona actual
        const indicatorsTitle = document.createElement('h5');
        indicatorsTitle.classList.add('mt-4', 'mb-2', 'text-center'); // Agregar clases de Bootstrap para márgenes y texto centrado
        indicatorsTitle.textContent = 'Indicadores';
        personForm.appendChild(indicatorsTitle);
    
        const indicatorsContainer = document.createElement('div');
        indicatorsContainer.classList.add('row', 'justify-content-center'); // Centrar los indicadores horizontalmente
        personForm.appendChild(indicatorsContainer);
    
        for (let i = 1; i <= 5; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.classList.add('col-md-6', 'mb-3'); // Agregar clases de Bootstrap para columnas
            indicatorsContainer.appendChild(inputDiv);
    
            const input = document.createElement('input');
            input.type = 'text';
            input.classList.add('form-control');
            input.placeholder = 'Indicador ' + i;
            input.required = true;
            input.value = ''; // Vaciar el valor del campo
            inputDiv.appendChild(input);
        }
    
        // Desplazamiento suave al formulario actual
        const formWidth = personForm.offsetWidth;
        const maxScroll = personFormsContainer.scrollWidth - personFormsContainer.clientWidth;
        const scrollPosition = maxScroll; // Desplazar hasta el final
        personFormsContainer.scrollLeft = scrollPosition;

        // Mostrar botones de acción y agregar espaciado superior
        prevButton.style.display = index > 0 ? 'block' : 'none';
        nextButton.style.display = index < 4 ? 'block' : 'none';
        prevButton.style.marginTop = '20px';
        nextButton.style.marginTop = '20px';
        
    }
    
    

    // Mostrar el formulario de la primera persona al cargar la página
    createPersonForm(currentPersonIndex);

    // Función para manejar el cambio al formulario anterior
    function goToPreviousForm() {
        if (currentPersonIndex > 0) {
            currentPersonIndex--;
            createPersonForm(currentPersonIndex);
            updateSubmitButtonState();
        }
    }

    // Función para manejar el cambio al formulario siguiente
    function goToNextForm() {
        if (currentPersonIndex < 4) {
            // Guardar los datos del formulario actual antes de avanzar al siguiente
            saveFormData();
            currentPersonIndex++;
            createPersonForm(currentPersonIndex);
            updateSubmitButtonState();
        }
    }

    // Función para guardar los datos del formulario actual en el array formData
    function saveFormData() {
    const inputs = document.querySelectorAll('.personForm input');
    const currentFormData = {};

    inputs.forEach((input, index) => {
        currentFormData[`indicator${index + 1}`] = input.value.trim();
    });

    formData[currentPersonIndex] = currentFormData;
    console.log(formData);
}

    // Función para actualizar el estado del botón de enviar
    function updateSubmitButtonState() {
        submitButton.disabled = currentPersonIndex < 4;
    }

    // Activar el botón de enviar en el último formulario al inicio
    updateSubmitButtonState();

    // Manejar el evento del botón "Anterior"
    prevButton.addEventListener('click', function() {
        goToPreviousForm();
    });

    // Manejar el evento del botón "Siguiente"
    nextButton.addEventListener('click', function() {
        goToNextForm();
    });

    // Manejar el evento del botón de enviar
    submitButton.addEventListener('click', function() {
        // Guardar los datos del último formulario antes de enviarlo
        saveFormData();
        // Aquí se puede enviar el formulario
        alert('¡Formulario enviado exitosamente!');
    });
});
