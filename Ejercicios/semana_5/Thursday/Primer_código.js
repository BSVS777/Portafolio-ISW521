// // console.log("Hello, World!");

// // if (true) {
// //     var edad = 25;
// // }
// // console.log(edad);

// // if (true) {
// //     let puntos = 100;
// //     console.log(puntos);
// // }

// // // console.log(puntos);

// // // const PI = 3.1416;
// // // PI = 3.14;

// // // const id = 12345;



// // const v8 = require("v8");

// // const miVariable = {

// //     nombre: "Juan",
// //     version:2026

// // };

// // const tamano = v8.serialize(miVariable).length;

// // console.log(`El tamaño de la variable es: ${tamano} bytes`);


// const readline = require("readline/promises");

// const {stdin: input, stdout: output} = require("process");

// const rl = readline.createInterface({input, output});

// async function iniciar() {
//     const nombre = await rl.question("¿Cuál es tu nombre? ");
//     if(validarDatos(nombre)){
//         console.log(`Hola, ${nombre}!`);
//     } else {
//         console.log("Nombre inválido. Por favor, introduce un nombre válido.");
//     }
//     rl.close();
// }

// function validarDatos(nombre){

//     const expresion = /^[a-zA-Z]+$/;
//     const nombreValido = expresion.test(nombre);

//     if(nombreValido){
//         return true;
//     }else{
//         return false;
//     }

// }

// iniciar();

// con ifs y ternarios

let readline = require("readline/promises");

let {stdin: input, stdout: output} = require("process");

let rl = readline.createInterface({input, output});

async function Edad() {
    const edad = await rl.question("¿Cuál es tu edad? ");
    return Number(edad);
}

function validarConIF(edad){

    if (edad >= 1 && edad  <= 12) {

        console.log("Eres un niño");

    }else if (edad >= 13 && edad <= 17) {

        console.log("Eres un joven");

    }else if (edad >= 18) {

        console.log("Eres un adulto");

    } else {

        console.log("Edad inválida");

    }

}

function validarConTernario(edad){

    const resultado = (edad >= 1 && edad <= 12) ? "Eres un niño" : (edad >= 13 && edad <= 17) ? "Eres un joven" : (edad >= 18) ? "Eres un adulto" : "Edad inválida";
    console.log(resultado);

}

async function main() {
    const edad = await Edad();
    validarConIF(edad);
    validarConTernario(edad);
    rl.close();
}

main();








