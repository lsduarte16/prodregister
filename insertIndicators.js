async function insertIndicatorDocument(document) {
    try {
        const response = await fetch('https://sa-east-1.aws.data.mongodb-api.com/app/apione-qfdvx/endpoint/chargeind', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(document)
        });

        const data = await response.json();

        if (response.ok) {
            // La inserción fue exitosa
            console.log('Documento insertado:', data);
            // Aquí puedes hacer cualquier otra cosa después de la inserción exitosa
        } else {
            // Hubo un error en la inserción
            console.error('Error al insertar el documento:', data);
        }
    } catch (error) {
        // Capturar errores de red u otros errores
        console.error('Error en la solicitud:', error);
    }
}

