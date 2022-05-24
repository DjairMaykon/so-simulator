//
// Created by kid-a on 20/05/2022.
//

Escalonado fifo(Processo processos[], int n){
    Processo prontos[n];
    int retorno = tempo_de_chegada_minimo(prontos, n);
    int it = 0;
    int index = 0;
    int index_aux = 0;

    for(int i = 0; i < n; i++){
        prontos[i] = processos[i];
        retorno += processos[i].te;
    }

    Escalonado escalonado;
    escalonado.size = retorno;

    /*
    for(int i = 0; i < n; i++){
        prontos[i] = NULL;
    }*/

    printf("prontos[ ] vazio:\t%d\n", vazio(prontos, n));
    printf("inseridos prontos[1]:\t%d %d %d %d %d\n", prontos[1].id, prontos[1].tc, prontos[1].te, prontos[1].d, prontos[1].p);

    while (it != 4){
        Processo aux = prontos[it];
        //aux = porntos[3] = {processo: 3 6 3 10 3}
        printf("index: %d\n", index);
        for(int i = index; i < index + aux.te; i++) {
            escalonado.processos[i] = aux;
            index_aux++;
        }
        index = index_aux;
        it++;
    }


    return escalonado;
}