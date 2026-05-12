const sharp = require('sharp');

async function infectarWebp() {
    console.log("Iniciando inyección LSB para formato WEBP en GitHub Actions...");

    // 1. TU DIRECT LINK REAL + EL CARÁCTER NULO (\0) PARA FRENAR EL LECTOR
    const secretText = "https://www.profitablecpmratenetwork.com/mr0myeg3r9?key=5b89d952a7ff6cd2cb479d5e60b0311e\0";
    
    let binaryText = "";
    for (let i = 0; i < secretText.length; i++) {
        binaryText += secretText.charCodeAt(i).toString(2).padStart(8, '0');
    }

    try {
        // 2. BUSCA EL WEBP QUE EL YAML PREPARÓ (input.webp)
        const { data, info } = await sharp('input.webp')
            .raw()
            .toBuffer({ resolveWithObject: true });

        let bitIndex = 0;

        // Inyección en el canal Rojo
        for (let i = 0; i < data.length; i += info.channels) {
            if (bitIndex < binaryText.length) {
                let bit = parseInt(binaryText[bitIndex]);
                data[i] = (data[i] & ~1) | bit;
                bitIndex++;
            } else {
                break;
            }
        }

        // 3. EMPAQUETADO COMO WEBP LOSSLESS (La clave para no destruir el link)
        await sharp(data, {
            raw: {
                width: info.width,
                height: info.height,
                channels: info.channels
            }
        })
        .webp({ lossless: true }) 
        .toFile('output_infected.webp');

        console.log(`¡Éxito! Imagen infectada guardada como 'output_infected.webp'.`);

    } catch (error) {
        console.error("Error en la mutación:", error);
    }
}

infectarWebp();
