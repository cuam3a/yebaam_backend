const fs = require('fs');
const path = require('path');
import { citiesCreatorServices } from './citiesCreator.service';

export const createCities = () => {
    const fileRoute = path.join(__dirname, "../../files/availableCities.json");

    let readableStream = fs.createReadStream(fileRoute, {
        autoClose: true,
    });
    readableStream.setEncoding('UTF8');

    let data = '';
    readableStream.on('data', async function (chunk: any) {
        data += chunk;

        if (data) {
            data = data.trim();
            //or data = JSON.parse(JSON.stringify(data.trim()));
            let cities = JSON.parse(data);
            for (let i = 0; i < cities.ciudades.length; i++) {
                let city = cities.ciudades[i]
                console.log("C: ", city)
                const cityToSave = { stateID: city.estado_id, cityID: city.ciudad_id, cityName: city.ciudadnombre };
                await citiesCreatorServices.saveCity(cityToSave);
            }
        }
    });

    // el evento end se lanza cuando se ha finalizado la lectura del archivo
    /* readableStream.on("end", () => {
        console.log("\nCiudades Registradas\n");
    }); */
}