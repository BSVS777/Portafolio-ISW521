const persona = { nombre: "Juan", edad: 50 };
const { edad: anos = 21 } = persona;
console.log(anos);

///////////////////////////////////////////////

function sumartodo(...numeros) {
    return numeros.reduce((a, b) => a + b, 0);
}

console.log(sumartodo(1,2,3,4,5));
console.log(sumartodo(5 , 10, 15, 20));

//////////////////////////////////////////////

const original = {nombre: "Equipo A", puntos: 10 };

const actualizado = { ...original, puntos: 15 };

console.log(original.puntos);
console.log(actualizado.puntos);

const numeros = [1 , 2, 3]
const copia = [...numeros, 4];

console.log(numeros);

////////////////////////////////////////////

const respuesta = {data: {usuario: null}};

const nombre = respuesta?.data?.usuario?.nombre;
console.log(nombre);

////////////////////////////////////////////

const descuento = 0;

console.log(descuento || 10);
console.log(descuento ?? 10);

const nombre = "";
console.log(nombre || "Invitado");
console.log(nombre ?? "Invitado");
