import { fifo } from "./fifo.js"
import { sjf } from "./sjf.js"

console.log("Inicio do programa:")

let n
let q
let s 

console.log("numero de processos:");
console.log(4);

console.log("quantum:");
console.log(2);

console.log("sobrecarga:");
console.log(0);

// lista de processos mockadas, depois deve se receber vinda do front
let listaProcessos = [
    {
        id: 0,
        tc: 4,
        te: 2,
        d: 1,
        p: 0
    },
    {
        id: 1,
        tc: 0,
        te: 4,
        d: 7,
        p: 1
    },
    {
        id: 2,
        tc: 2,
        te: 2,
        d: 5,
        p: 2
    },
    {
        id: 3,
        tc: 4,
        te: 1,
        d: 8,
        p: 3
    },
]

let escalonadoFifo = fifo(listaProcessos)
console.log("Imprimindo FIFO:");
for(let i = 0; i < escalonadoFifo.length; i++){
    console.log(`[${i}]:\t${escalonadoFifo[i].id} ${escalonadoFifo[i].tc} ${escalonadoFifo[i].te} ${escalonadoFifo[i].d} ${escalonadoFifo[i].p}`)
}

let escalonadoSjf = sjf(listaProcessos)
console.log("\nImprimindo SJF:");
for(let i = 0; i < escalonadoFifo.length; i++){
    console.log(`[${i}]:\t${escalonadoFifo[i].id} ${escalonadoFifo[i].tc} ${escalonadoFifo[i].te} ${escalonadoFifo[i].d} ${escalonadoFifo[i].p}`)
}