import {Animal} from './Animal.js';

export class Chancho extends Animal {
    constructor(nombre, especie, raza, edad) {
        super(nombre, especie);
        this.raza = raza;
        this.edad = edad;
    }

    dormir() {
        console.log(`El chancho llamado ${this.nombre} está durmiendo`);
    }
}