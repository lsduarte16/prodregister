// No necesitas requerir MongoClient en el navegador

// Define la URL del endpoint de tu API en el servidor que se comunica con MongoDB
const apiEndpoint = 'https://sa-east-1.aws.data.mongodb-api.com/app/data-xvqxq/endpoint/data/v1;

// Función para autenticar el usuario en el servidor
async function login(lsduarteh, X0JJKmX7IioYx670) {
  try {
    const response = await fetch(`${apiEndpoint}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
    });
    const data = await response.json();
    return data; // Devuelve la respuesta del servidor
  } catch (error) {
    console.error('Error:', error);
    throw new Error('Error de conexión con el servidor');
  }
}
