const readline = require("readline/promises");

const {stdin: input, stdout: output} = require("process");

const rl = readline.createInterface({input, output});

async function iniciar() {
    const mes = await rl.question("¿Cuál es tu nombre? ");
    if(validarDatos(mes)){
        console.log(`Hola, ${mes}!`);
    } else {
        console.log("Nombre inválido. Por favor, introduce un nombre válido.");
    }
    rl.close();
}

switch (mes) {
    case "Enero":
        console.log("Estamos en enero");
        break;
    case "Febrero":
        console.log("Estamos en febrero");
        break;
    case "Marzo":
        console.log("Estamos en marzo");
        break;
    case "Abril":
        console.log("Estamos en abril");
        break;
    case "Mayo":
        console.log("Estamos en mayo");
        break;
    case "Junio":
        console.log("Estamos en junio");
        break;
    case "Julio":
        console.log("Estamos en julio");
        break;
    case "Agosto":
        console.log("Estamos en agosto");
        break;
    case "Septiembre":
        console.log("Estamos en septiembre");
        break;
    case "Octubre":
        console.log("Estamos en octubre");
        break;
    case "Noviembre":
        console.log("Estamos en noviembre");
        break;
    case "Diciembre":
        console.log("Estamos en diciembre");
        break;
    default:
        console.log("Mes inválido. Por favor, introduce un mes válido.");
        break;
}


