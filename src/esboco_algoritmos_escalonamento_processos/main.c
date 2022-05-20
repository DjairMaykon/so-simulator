#include <stdio.h>

typedef struct {
    int id;
    int tc; //arrival time
    int te; //execution time
    int d;  //deadline
    int p;  //priority
}Processo;

int sort_processos_exec(Processo processos[], int n, int rm){
    for(int i = 1 + rm; i < n; i++){
        for(int j = 0 + rm; j < n - 1; j++){
            if(processos[j].te > processos[j + 1].te){
                Processo aux = processos[j];
                processos[j] = processos[j + 1];
                processos[j + 1] = aux;
            }
        }
    }
    return 1;
}

int sort_gap(int vet[], int n, int gap){
    for(int i = 1 + gap; i < n; i++){
        for(int j = 0 + gap; j < n - 1; j++){
            if(vet[j] > vet[j + 1]){
                int aux = vet[j];
                vet[j] = vet[j + 1];
                vet[j + 1] = aux;
            }
        }
    }
    return 1;
}

int fifo(int matriz[][30], Processo processos[], int n){
    int start = 0;
    for(int i = 0; i < n; i++){
        Processo aux = processos[i];
        for(int j = start; j < start + aux.te; j++){
            matriz[i][j] = 1;
        }
        start += aux.te;
    }
    return 1;
}

int sjf(int matriz[][30], Processo processos[], int n){
    Processo fila[n];
    fila[0] = processos[0];
    int i = 0;
    int rm = 0;

    //inicializando a fila ordenada
    while(i < n){
        for(int j = 0; j < 30; j++){
            if(fila[i].tc >= j){
                fila[i] = processos[i];
                i++;
                if(processos[i].te == j){
                    rm++;
                    printf("pre-sort: %d %d %d %d\n", fila[0].id, fila[1].id, fila[2].id, fila[3].id);
                    sort_processos_exec(fila, i, rm);
                    printf("sorted: %d %d %d %d\n", fila[0].id, fila[1].id, fila[2].id, fila[3].id);
                }
            }
        }
    }

    int var[] = {3, 4, 2, 0, 7, 9, 5, 1};
    sort_gap(var, 8, 4);
    printf("var: ");
    for(int i = 0; i < 8; i++){
        printf("%d ", var[i]);
    }
    printf("\n");

    int start = 0;
    for(int i = 0; i < n; i++){
        Processo aux = fila[i];
        for(int j = start; j < start + aux.te; j++){
            matriz[i][j] = 1;
        }
        start += aux.te;
    }
    return 1;
    return 1;
}



int imprime_matriz(int matriz[][30], int n){
    for(int i = 0; i < n; i++){
        printf("%d :", i);
        for(int j = 0; j < 30; j++){
            printf("%d", matriz[i][j]);
        }
        printf("|\n");
    }
    return 1;
}

int main() {
    int n;  //process qtd
    int sobrecarga;
    int quantum;
    int m = 30;  //overall execution time

    printf("Comeco do programa:\n");
    scanf("%d %d %d", &n, &quantum, &sobrecarga);

    int matriz[n][m];
    Processo processos[n];

    for(int i = 0; i < n; i++){
        for(int j = 0; j < m; j++){
            matriz[i][j] = 0;
        }
    }

    imprime_matriz(matriz, n);

    for(int i = 0; i < n; i++){
        Processo aux;
        scanf("%d %d %d %d", &aux.tc, &aux.te, &aux.d, &aux.p);
        aux.id = i;
        processos[i] = aux;
    }

    sjf(matriz, processos, n);

    imprime_matriz(matriz, n);

    return 0;
}
