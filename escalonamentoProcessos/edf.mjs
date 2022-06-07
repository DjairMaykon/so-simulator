import { tempoDeChegadaMinimo, vazio } from "./processo.mjs";

function ordenaProntos(a, b) {
  if (a.tc < b.tc) return -1;
  if (a.tc > b.tc) return 1;
  if (a.p < b.p) return -1;
  if (a.p > b.p) return 1;
  if (a.id < b.id) return -1;
  if (a.id > b.id) return 1;
  return 0;
}

export function edf(processos, quantum) {
  let n = processos.length;
  let retorno = tempoDeChegadaMinimo(processos);
  let processosProntos = [];
  //processosProntos.sort(ordenaProntos)
  preparaListaProntos(processos, processosProntos);
  // console.log("\nprontos:")
  // console.log(processosProntos);
  let it = 0;
  let index = 0;
  let index_aux = 0;

  // for(let i = 0; i < n; i++){
  //     processosProntos[i] = processos[i]
  //     retorno += processos[i].te
  // }

  let escalonado = [];

  // console.log(`prontos[ ] vazio:\t${vazio(processosProntos)}`)
  // console.log(`inseridos prontos[1]:\t${processosProntos[1].id} ${processosProntos[1].tc} ${processosProntos[1].te} ${processosProntos[1].d} ${processosProntos[1].p}\n`)

  while (it != processosProntos.length) {
    let aux = processosProntos[it];
    // console.log(`index: ${index}\n`)
    for (let i = index; i < index + aux.te; i++) {
      escalonado.push(aux);
      aux.ter -= 1;
      if (aux.ter % quantum == 0 && aux.ter >= quantum) {
        escalonado.push("sobrecarga");
      }

      index_aux++;
    }
    index = index_aux;
    it++;
  }

  console.log("escalonados:\n");
  console.log(escalonado);
  return escalonado;
}

function preparaListaProntos(processos, processosProntos) {
  let p = [];
  for (let i = 0; i < processos.length; i++) {
    p[i] = processos[i];
  }
  let sumRetorno = 0,
    menor = 0;
  p.sort(ordenaProntos);
  processosProntos.push(p.shift());
  sumRetorno = processosProntos[0].te;

  while (p.length > 1) {
    let pivo = 300;
    for (let i = 0; i < p.length; i++) {
      if (p[i].d < pivo && p[i].tc <= sumRetorno) {
        pivo = p[i].d;
        menor = i;
      }
    }
    sumRetorno += p[menor].te;
    processosProntos.push(p[menor]);
    p.splice(menor, 1);
  }
  if (p.length == 1) {
    processosProntos.push(p.shift());
  }

  console.log("\nprontos:");
  console.log(processosProntos);
}
