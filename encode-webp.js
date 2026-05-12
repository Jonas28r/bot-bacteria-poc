const sharp = require('sharp');

async function infectarWebp() {
    console.log("Iniciando inyección LSB para formato WEBP en GitHub Actions...");

    const secretText = "https://adsterra-direct-link.com/12345[END]";
    let binaryText = "";
    for (let i = 0; i < secretText.length; i++) {
        binaryText += secretText.charCodeAt(i).toString(2).padStart(8, '0');
    }

    try {
        // Leemos la imagen (asumiendo que sigues subiendo 'input.png' de prueba)
        const { data, info } = await sharp('input.png')
            .raw()
            .toBuffer({ resolveWithObject: true });

        let bitIndex = 0;

        for (let i = 0; i < data.length; i += info.channels) {
            if (bitIndex < binaryText.length) {
                let bit = parseInt(binaryText[bitIndex]);
                data[i] = (data[i] & ~1) | bit;
                bitIndex++;
            } else {
                break;
            }
        }

        // Empaquetamos como WEBP Lossless
        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
        .webp({ lossless: true }) // LA CLAVE
        .toFile('output_infected.webp');

        console.log(`¡Éxito! Imagen guardada como 'output_infected.webp'.`);

    } catch (error) {
        console.error("Error en la mutación:", error);
    }
}

infectarWebp();

