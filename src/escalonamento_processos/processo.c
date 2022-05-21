//
// Created by kid-a on 20/05/2022.
//


typedef struct {
    int id;
    int tc; //tempo de chegada
    int te; //tempo de execução
    int d;  //deadline
    int p;  //prioridade
}Processo;

typedef struct {
    int size;
    Processo processos[40]; //tamanho de tempo de execucao total
}Escalonado;


int compara_tempo_de_chegada(Processo a, Processo b){
    if((a.tc <= b.tc) && (a.te) > b.te){
        return -1;
    }else if((a.tc >= b.tc) && a.te > b.te){
        return 1;
    }else{
        return 0;
    }
}

int tempo_de_chegada_minimo(Processo processos[], int n){
    int min = 30; //definido arbitrariamente
    Processo aux;
    for(int i = 0; i < n; i++){
        aux = processos[i];
        if(aux.tc < min){
            min = aux.tc;
        }
    }
    return min;
}

int vazio(Processo processos[], int n){
    for(int i = 0; i < n; i++){
        if(processos[i].te){
            return 0;
        }
    }
    return 1;
}

int tamanho(Processo processos[], int n){
    int tam = 0;
    for(int i = 0; i < n; i++){
        if(processos[i].te){
            tam ++;
        }
    }
    return tam;
}



