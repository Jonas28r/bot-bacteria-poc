const Jimp = require('jimp');

async function infectarImagen() {
    console.log("Iniciando el proceso de inyección LSB...");

    // 1. El enlace que queremos ocultar. 
    // Agregamos un delimitador "[END]" para que el frontend sepa cuándo dejar de leer.
    const secretText = "https://adsterra-direct-link.com/12345[END]";
    
    // 2. Convertir el texto a binario puro (ceros y unos)
    let binaryText = "";
    for (let i = 0; i < secretText.length; i++) {
        // Obtenemos el código de la letra y lo pasamos a binario de 8 bits
        let bin = secretText.charCodeAt(i).toString(2).padStart(8, '0');
        binaryText += bin;
    }

    try {
        // 3. Cargar la imagen de prueba
        const image = await Jimp.read('input.png');
        let bitIndex = 0;
        let inyeccionCompletada = false;

        // 4. Escanear píxel por píxel de izquierda a derecha, de arriba a abajo
        image.scan(0, 0, image.bitmap.width, image.bitmap.height, function(x, y, idx) {
            if (inyeccionCompletada) return;

            // idx representa el canal Rojo (Red). 
            // idx+1 es Verde, idx+2 es Azul, idx+3 es Transparencia (Alpha).
            // Solo modificaremos el canal Rojo para este experimento.
            let red = this.bitmap.data[idx];

            if (bitIndex < binaryText.length) {
                let bit = parseInt(binaryText[bitIndex]);
                
                // MAGIA NEGRA AQUÍ: 
                // Limpiamos el último bit del color rojo original y le incrustamos nuestro bit secreto.
                red = (red & ~1) | bit; 
                
                // Guardamos el nuevo color alterado en la imagen
                this.bitmap.data[idx] = red;
                bitIndex++;
            } else {
                inyeccionCompletada = true;
            }
        });

        // 5. Exportar la nueva imagen "Caballo de Troya"
        await image.writeAsync('output_infected.png');
        console.log(`¡Éxito! La imagen infectada ha sido generada como 'output_infected.png'.`);
        console.log(`Se ocultaron ${binaryText.length} bits en la imagen.`);

    } catch (error) {
        console.error("Error procesando la imagen:", error);
    }
}

infectarImagen();
