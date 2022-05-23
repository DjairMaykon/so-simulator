import { tempoDeChegadaMinimo, vazio } from "./processo.js"

function ordenaProntos(a, b) {
    if (a.tc < b.tc)
        return -1;
    if (a.tc > b.tc)
        return 1;
    if (a.p < b.p)
        return -1;
    if (a.p > b.p)
        return 1;
    if (a.id < b.id)
        return -1;
    if (a.id > b.id)
        return 1;
    return 0;
}

export function rr(processos, quantum, sobrecarga){
    let prontos = [];
    let temposChegada = [];
    let escalonado = [];
    let retorno = tempoDeChegadaMinimo(processos);
    preparaListaProntos(processos, prontos, temposChegada, retorno);

    while(prontos.length > 0){
        let p = prontos.shift();
        if(p.ter >= quantum){
            p.ter -= quantum;
            retorno += quantum;
            preparaListaProntos(processos, prontos, temposChegada, retorno);

            for(let i = 0; i < quantum; i++){
                escalonado.push(p);
            }

            if(p.ter > 0){
                for(let i = 0; i < sobrecarga; i++){
                    escalonado.push("Sobracarga");
                }
            }

            prontos.push(p);
        }else{
            for(let i = 0; i < p.ter; i++){
                escalonado.push(p);
            }
            retorno += p.ter;
        }
        
    }

    return escalonado;

}

function preparaListaProntos(processos, prontos, temposChegada, retorno){
    let min = 0;

    for(let p in processos){
        if(!temposChegada.includes(processos[p].tc) && processos[p].tc <= retorno){
            if(!prontos.includes(processos[p])){
                min = processos[p].tc;
                temposChegada.push(min);
                for(let i in processos){
                    if(processos[i].tc == min){
                        prontos.push(processos[i]);
                    }
                }
            }
        }
    }
}