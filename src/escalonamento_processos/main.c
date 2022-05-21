#include <stdio.h>
#include "processo.c"
#include "fifo.c"
#include "sjf.c"

int main() {
    printf("Inicio do programa:\n");
    int n;  //numero_processos
    int q;  //quantum
    int s;  //sobrecarga

    printf("numero de processos: \n");
    scanf("%d", &n);

    printf("quantum: \n");
    scanf("%d", &q);

    printf("sobrecarga: \n");
    scanf("%d", &s);

    Processo lista_processos[n];
    Escalonado escalonado;

    for(int i = 0; i < n; i++){
        Processo aux;
        scanf("%d %d %d", &aux.tc, &aux.te, &aux.d);
        aux.id = i;
        aux.p = i;
        lista_processos[i] = aux;
        printf("dados inseridos:\t%d %d %d %d %d\n", lista_processos[i].id, lista_processos[i].tc, lista_processos[i].te, lista_processos[i].d, lista_processos[i].p);
    }

    //lista_processos[4] = {A, B, C, D}

    escalonado = fifo(lista_processos, n);

    //imprimindo fifo
    printf("\nImprimindo FIFO:\n");
    for(int i = 0; i < escalonado.size; i++){
        printf("[%d]: %d %d %d %d %d\n", i, escalonado.processos[i].id, escalonado.processos[i].tc, escalonado.processos[i].te, escalonado.processos[i].d, escalonado.processos[i].p);
    }

    return 0;
}
