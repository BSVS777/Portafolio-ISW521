// arreglo = [1, 2, 3, 4, 5];

// arreglo.sort((a, b) => b - a);
// console.log(arreglo);



// let arr = ["a", "b", "c"];
// console.log(arr[2]);


// const dobleImp = [];
// for (let i = 0; i < arreglo.length; i++) {
//     dobleImp.push(arreglo[i] * 2);
// }

// const dobleImp = arreglo.map((num) => num * 2);



// const precios = [100, 250, 80, 400];
// const caros = precios.filter((precio) => precio > 100);
// console.log(caros);

// const estudiantes = [
//     {nombre : "Ana", carnet : "202330445"},
//     {nombre : "Juan", carnet : "202330446"}
// ];

// estudiantes.map(e=>`${e.nombre}(${e.carnet}))`.toUpperCase());


const estudiantes = [

    {nombre: "Ana", promedio : "85"},
    {nombre: "Juan", promedio : "90"},
    {nombre: "Maria", promedio : "78"}

]

resultado = estudiantes.filter((estudiante) => estudiante.promedio >= 80).map((estudiante) => estudiante.nombre);
console.log(resultado);

