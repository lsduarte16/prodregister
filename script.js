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
        const response = await authenticateUserWithAPI(username, password);
        //console.log(response)

        if (response.success) {
            showAlert('success', response.message);
            loginForm.classList.add('hidden');

            if (response.role === 'supervisor') {
                registrationForm.classList.remove('hidden');
                document.getElementById('nombreSupervisor').value = response.nombre;
                document.getElementById('idSupervisor').value = response.idSupervisor;
                // Cargar la fecha y hora actual en el campo de Fecha Proceso
                const currentDate = new Date();
                const year = currentDate.getFullYear();
                const month = ('0' + (currentDate.getMonth() + 1)).slice(-2);
                const day = ('0' + currentDate.getDate()).slice(-2);
                const hours = ('0' + currentDate.getHours()).slice(-2);
                const minutes = ('0' + currentDate.getMinutes()).slice(-2);
                const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}`;
                document.getElementById('fechaProceso').value = formattedDate;
                  // Llamada a la función createPersonForm con employeesData como parámetro
            } else if (response.role === 'gerente') {
                chartsViewGerente.classList.remove('hidden');
                showCharts();
            }
        } else {
            showAlert('error', response.message);
        }
    } catch (error) {
        //console.error('Error:', error);
        showAlert('error', 'Error de conexión al cargar datos de usuario');
    }
});

async function authenticateUserWithAPI(username, password) {
    try {
        const response = await fetch('https://sa-east-1.aws.data.mongodb-api.com/app/apione-qfdvx/endpoint/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            let employeesData = [];

            // Si el usuario autenticado es un supervisor, obtener la lista de empleados
            if (data.role === 'supervisor') {
                const employeesResponse = await fetch('https://sa-east-1.aws.data.mongodb-api.com/app/apione-qfdvx/endpoint/employees', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        supervisorId: data.idSupervisor
                    })
                });

                employeesData = await employeesResponse.json();
                // Convertir a cadena JSON
                const employeesDataJSON = JSON.stringify(employeesData);

                // Guardar en localStorage
                localStorage.setItem('employeesData', employeesDataJSON);


            }

            return { 
                success: true, 
                message: '¡Acceso exitoso!', 
                role: data.role, 
                nombre: data.nombre, 
                idSupervisor: data.idSupervisor, 
                employees: employeesData 
                
            };

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
    const formData = []
    let currentPersonIndex = 0;
    
    
    const storedDataJSON = localStorage.getItem('employeesData');
    //console.log(storedDataJSON)
    const response = JSON.parse(storedDataJSON);
    //console.log(response);

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
        //const response = await fetch('employers.json');
        //console.log(response);
        //const employees = await response.json();
        //console.log(employees);
        //const employee = employees[index];
        //console.log(employee);


        //Obtener los datos de los empleados desde el archivo JSON
        
        //const employees = await response.json();
        //console.log(employees);
        const employee = await response[index];
        //console.log(employee);
  

                
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
    
        const indicadores = [
            "Preparación",
            "Scan",
            "Rearmado",
            "Recepción",
            "Ingreso caja",
            "Despacho",
            "Envío a externo"
        ];
        
        
        for (let i = 1; i <= 5; i++) {
            const inputDiv = document.createElement('div');
            inputDiv.classList.add('col-md-6', 'mb-3'); // Agregar clases de Bootstrap para columnas
            indicatorsContainer.appendChild(inputDiv);
    
            const input = document.createElement('input');
            input.type = 'number';
            input.classList.add('form-control');
            input.placeholder = indicadores[i];
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
        nextButton.style.display = currentPersonIndex <response.length -1 ? 'block' : 'none';
        //console.log( response.length -1 )

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
        if (currentPersonIndex < response.length -1) {
            // Guardar los datos del formulario actual antes de avanzar al siguiente
            saveFormData();
            // Incrementar el índice solo si no existe ya un formulario para el siguiente índice
            if (!document.getElementById(`personForm_${currentPersonIndex + 1}`)) {
                currentPersonIndex++;
            }
            createPersonForm(currentPersonIndex);
            updateSubmitButtonState();
        }
    }
    
    // Función para guardar los datos del formulario actual en el array formData
    async function saveFormData(response) {
        const inputs = document.querySelectorAll('.personForm input');

        // Recorrer cada elemento del array response
        response.forEach((employee, index) => {
        const currentFormData = {};
    
        // Obtener supervisorId y idemploye del objeto employee
        const supervisorId = employee.supervisorId;
        const idemploye = employee.idemploye;

        // Agregar códigos de supervisor y trabajador
        currentFormData['codigoSupervisor'] = supervisorId;
        currentFormData['codigoTrabajador'] = idemploye;
    
        inputs.forEach((input, i) => {
            currentFormData[`indicator${i + 1}`] = input.value.trim();
        });
    
        // Agregar fecha y hora actual
        const currentDate = new Date();
        currentFormData['fechaHora'] = currentDate.toLocaleString();

        // Guardar los datos en formData usando el índice actual
        formData[index] = currentFormData;
    });
}

    // Función para actualizar el estado del botón de enviar
    function updateSubmitButtonState() {
        submitButton.disabled = currentPersonIndex < response.length -1;
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

    // Dentro del evento del botón de enviar
    submitButton.addEventListener('click', async function() {
        // Guardar los datos del último formulario antes de enviarlo
        await saveFormData(response);
        // Insertar cada documento en la base de datos
        for (let i = 0; i < formData.length; i++) {
            await insertIndicatorDocument(formData[i]);
        }
        // Notificar al usuario que el formulario fue enviado exitosamente
        alert('¡Formulario enviado exitosamente!');
    });
});
