const fs = require('fs');
const path = require('path');
import { statesCreatorServices } from './statesCreator.service';

export const createStates = () => {
    const rutaArchivo = path.join(__dirname, "../../files/states.json");

    let readableStream = fs.createReadStream(rutaArchivo, {
        autoClose: true,
    });
    readableStream.setEncoding('UTF8');

    let data = '';
    readableStream.on('data', async function (chunk: any) {
        data += chunk;

        if (data) {
            data = data.trim();
            //or data = JSON.parse(JSON.stringify(data.trim()));
            let states = JSON.parse(data);
            for (let i = 0; i < states.estados.length; i++) {
                let state = states.estados[i]
                console.log("S: ", state)
                const stateToSave = { countryID: state.pais_id, stateID: state.estado_id, stateName: state.estadonombre };
                await statesCreatorServices.saveState(stateToSave);
            }
        }
    });

    // el evento end se lanza cuando se ha finalizado la lectura del archivo
    /* readableStream.on("end", () => {
        console.log("\nEstados Registrados\n");
    }); */

    /* let data = '';
    let chunk;
    readableStream.on('readable', async function () {
        while ((chunk = readableStream.read()) != null) {
            data += chunk;
        }
        if (data) {
            data = data.trim();
            //or data = JSON.parse(JSON.stringify(data.trim()));
            let states = JSON.parse(data);
            for (let i = 0; i < states.estados.length; i++) {
                let state = states.estados[i]
                const stateToSave = { countryID: state.pais_id, stateID: state.estado_id, stateName: state.estadonombre };
                console.log("I: ", i)
                await statesCreatorServices.saveState(stateToSave);
            }
        }
    }); */
}