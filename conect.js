
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://lsduarteh:X0JJKmX7IioYx670@cluster0.orinmig.mongodb.net/?retryWrites=true&w=majority";

// Función para conectar a MongoDB Atlas
    async function login(username, password) {
        const client = new MongoClient(uri);
    
        try {
            await client.connect();
            const db = client.db('bd1');
            const collection = db.collection('usuarios');
    
            // Buscar el usuario por nombre de usuario
            const user = await collection.findOne({ email, contraseña });
    
            // Verificar si se encontró el usuario
            if (user) {
                // Devolver un objeto con indicador de éxito y el rol del usuario
                return { success: true, role: user.role, message: '¡Acceso exitoso!' };
            } else {
                // Si el usuario no se encontró, devolver un objeto con indicador de error
                return { success: false, message: 'Usuario o contraseña incorrectos' };
            }
            } catch (error) {
            // Manejar errores de conexión o consultas a la base de datos
            console.error('Error de conexión a la base de datos:', error);
            return { success: false, message: 'Error de conexión a la base de datos' };
            } finally {
            // Cerrar el cliente de MongoDB
            await client.close();
            }
            }
    
    module.exports = { login };