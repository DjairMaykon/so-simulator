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

export function sjf(processos) {
    let n = processos.length
    let retorno = tempoDeChegadaMinimo(processos)

    let processosProntos = processos
    processosProntos.sort(ordenaProntos)
    let it = 0
    let index = 0
    let index_aux = 0

    for(let i = 0; i < n; i++){
        processosProntos[i] = processos[i]
        retorno += processos[i].te
    }

    let escalonado = []

    console.log(`prontos[ ] vazio:\t${vazio(processosProntos)}`)
    console.log(`inseridos prontos[1]:\t${processosProntos[1].id} ${processosProntos[1].tc} ${processosProntos[1].te} ${processosProntos[1].d} ${processosProntos[1].p}\n`)

    while (it != processos.length){
        let aux = processosProntos[it]
        console.log(`index: ${index}\n`)
        for(let i = index; i < index + aux.te; i++){
            escalonado[i] = aux;
            index_aux++;
        }
        index = index_aux;
        it++;
    }

    return escalonado
}