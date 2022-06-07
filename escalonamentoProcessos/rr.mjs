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

export function rr(processos, quantum, sobrecarga) {
  let prontos = [];
  let temposChegada = [];
  let escalonado = [];
  let retorno = tempoDeChegadaMinimo(processos);
  preparaListaProntos(processos, prontos, temposChegada, retorno);

  while (prontos.length > 0) {
    let p = prontos.shift();
    if (p.ter >= quantum) {
      p.ter -= quantum;
      retorno += quantum;
      preparaListaProntos(processos, prontos, temposChegada, retorno);

      for (let i = 0; i < quantum; i++) {
        escalonado.push(p);
      }

      if (p.ter > 0) {
        for (let i = 0; i < sobrecarga; i++) {
          escalonado.push("Sobracarga");
        }
      }

      prontos.push(p);
    } else {
      for (let i = 0; i < p.ter; i++) {
        escalonado.push(p);
      }
      retorno += p.ter;
    }
  }

  for (let i = 0; i < processos.length; i++) {
    processos[i].ter = processos[i].te;
  }

  return escalonado;
}

function preparaListaProntos(processos, prontos, temposChegada, retorno) {
  let min = 0;
  let processos_aux = [];
  for (let i = 0; i < processos.length; i++) {
    processos_aux.push(processos[i]);
  }

  for (let p in processos_aux) {
    if (
      !temposChegada.includes(processos_aux[p].tc) &&
      processos_aux[p].tc <= retorno
    ) {
      if (!prontos.includes(processos_aux[p])) {
        min = processos_aux[p].tc;
        temposChegada.push(min);
        for (let i in processos_aux) {
          if (processos_aux[i].tc == min) {
            prontos.push(processos_aux[i]);
          }
        }
      }
    }
  }
}
