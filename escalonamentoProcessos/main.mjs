import { fifo } from "./fifo.mjs";
import { sjf } from "./sjf.mjs";
import { rr } from "./rr.mjs";
import { edf } from "./edf.mjs";

console.log("Inicio do programa:");

let n;
let q;
let s;

console.log("numero de processos:");
console.log(4);

console.log("quantum:");
console.log(2);

console.log("sobrecarga:");
console.log(1);

// lista de processos mockadas, depois deve se receber vinda do front
let listaProcessos = [
  {
    id: 0,
    tc: 0,
    te: 4,
    ter: 4,
    d: 7,
    p: 0,
  },
  {
    id: 1,
    tc: 2,
    te: 2,
    ter: 2,
    d: 5,
    p: 1,
  },
  {
    id: 2,
    tc: 4,
    te: 1,
    ter: 1,
    d: 8,
    p: 2,
  },
  {
    id: 3,
    tc: 6,
    te: 3,
    ter: 3,
    d: 10,
    p: 3,
  },
];

let escalonadoFifo = fifo(listaProcessos);
console.log("Imprimindo FIFO:");
for (let i = 0; i < escalonadoFifo.length; i++) {
  console.log(
    `[${i}]:\t${escalonadoFifo[i].id} ${escalonadoFifo[i].tc} ${escalonadoFifo[i].te} ${escalonadoFifo[i].d} ${escalonadoFifo[i].p}`
  );
}

let escalonadoSjf = sjf(listaProcessos);
console.log("\nImprimindo SJF:");
for (let i = 0; i < escalonadoFifo.length; i++) {
  console.log(
    `[${i}]:\t${escalonadoSjf[i].id} ${escalonadoSjf[i].tc} ${escalonadoSjf[i].te} ${escalonadoSjf[i].d} ${escalonadoSjf[i].p}`
  );
}

let escalonadoRR = rr(listaProcessos, 2, 1);
console.log("\nImprimindo RR:");
console.log(escalonadoRR);
// for(let i = 0; i < escalonadoFifo.length; i++){
//     if(escalonadoRR[i] == "Sobrecarga"){
//         console.log("SObrecarga");
//     }else{
//         console.log(`[${i}]:\t${escalonadoRR[i].id} ${escalonadoRR[i].tc} ${escalonadoRR[i].te} ${escalonadoRR[i].ter} ${escalonadoRR[i].d} ${escalonadoRR[i].p}`);
//     }
// }

let escalonadoEDF = edf(listaProcessos, 2, 1);
