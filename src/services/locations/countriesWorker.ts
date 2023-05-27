const fs = require('fs');
const path = require('path');
import { countriesCreatorServices } from './countriesCreator.service';

export const createCountries = () => {
    const rutaArchivo = path.join(__dirname, "../../files/countries.json");

    fs.readFile(rutaArchivo, 'utf-8', async (err: any, data: any) => {
        if (data) {
            data = data.trim();
            //or data = JSON.parse(JSON.stringify(data.trim()));
            let countries = JSON.parse(data);
            for (let i = 0; i < countries.paises.length; i++) {
                let country = countries.paises[i]
                const countryToSave = { countryID: country.pais_id, countryName: country.paisnombre };

                await countriesCreatorServices.saveCountry(countryToSave);
            }
        }
    });
}