// import {sumar, restar} from './operadores.js';

// console.log(sumar(5, 10));
// console.log(restar(10, 5));

// import {Chancho} from './Chancho.js';

// const chanchoEmonte = new Chancho("Zoldryk", "Mamifero", "D'Monte", 5);

// console.log(chanchoEmonte);
// chanchoEmonte.dormir();

class cuentaBancaria {
    constructor(saldoInicial){

        this._saldo = saldoInicial;

    }
    get saldo(){
        return this._saldo;
    }
    set saldo(valor){
        if(valor < 0) throw new Error ("El saldo no puede ser negativo");
        this._saldo = valor;
    }
}

const cuenta = new cuentaBancaria(1000);
cuenta.saldo = 500;
console.log(cuenta.saldo);

