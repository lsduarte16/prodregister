const authenticationFunctions = {
    authenticateUserWithAPI: async (username, password) => {
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
                return {
                    success: false,
                    message: 'Usuario o contraseña incorrectos'
                };
            }
        } catch (error) {
            throw new Error('Error al cargar datos de usuario');
        }
    },
    // Otras funciones relacionadas con la autenticación...
};


