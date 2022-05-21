//
// Created by kid-a on 20/05/2022.
//

void prepara_lista_prontos(Processo processos[],  Processo lista_prontos[], int n){
    Processo p[n];
    Processo processo_vazio;
    processo_vazio.te = 0;
    int sumRetorno = 0;
    int menor = 0;
    int tam = n;
    int it = 0;
    int pivo;

    for(int i = 0; i < n; i++){
        p[i] = processos[i];
    }

    lista_prontos[it] = p[it];
    p[it] = processo_vazio;
    for(int i = it; i < n - 1; i++){
        Processo aux;
        aux = p[i];
        p[i] = p[i + 1];
        p[i + 1] = aux;
    }
    tam--;
    sumRetorno = lista_prontos[0].te;

    while (tamanho(p, n) > 1){
        pivo = 0;
        for(int i = 1; i < tam; i++){
            if((p[pivo].te <= p[i].te && p[pivo].tc < sumRetorno)){
                menor = pivo;
            }else if((p[i].tc < sumRetorno)){
                pivo = i;
                menor = i;
            }
        }
        it++;
        sumRetorno += p[menor].te;
        lista_prontos[it] = p[menor];
        p[menor] = processo_vazio;
        for(int i = menor; i < n - 1; i++){
            Processo aux;
            aux = p[i];
            p[i] = p[i + 1];
            p[i + 1] = aux;
        }
        tam--;
    }

    if(tamanho(p, n) == 1){
        lista_prontos[it] = p[0];
        p[0] = processo_vazio;
    }

    printf("\nprocessos ordenados:\n");
    for(int i = 0; i < n; i++){
        printf("processo %d\n", lista_prontos[i].id);
    }
    printf("\n");
}

Escalonado sjf(Processo processos[], int n){
    int retorno = tempo_de_chegada_minimo(processos, n);
    Processo prontos[n];
    prepara_lista_prontos(processos, prontos, n);

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
        for(int i = index; i < index + aux.te; i++) {
            escalonado.processos[i] = aux;
            index_aux++;
        }
        index = index_aux;
        it++;
    }

    return escalonado;
}