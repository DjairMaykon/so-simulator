
export function tempoDeChegadaMinimo(processos){
    let n = processos.length
    let min = Math.max()
    let aux;

    for(let i = 0; i < n; i++){
        aux = processos[i];
        if(aux.tc < min){
            min = aux.tc;
        }
    }

    return min
}

export function comparaTempoDeChegada(a, b){
    if((a.tc <= b.tc) && (a.te) > b.te){
        return -1;
    }else if((a.tc >= b.tc) && a.te > b.te){
        return 1;
    }else{
        return 0;
    }
}

export function vazio(processos){
    let n = processos.length
    for(let i = 0; i < n; i++){
        if(processos[i].te){
            return 0;
        }
    }
    return 1;
}

export function tamanho(processos){
    let tam = 0;
    let n = processos.length
    for(let i = 0; i < n; i++){
        if(processos[i].te){
            tam ++;
        }
    }
    return tam;
}