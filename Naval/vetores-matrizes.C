#include <stdio.h>

#define Linhas 5
#define Colunas 5

int main () {

    int matriz[Linhas] [Colunas];

    int soma = 0;

    for (int i = 0; i < Linhas; i++){
        for (int j = 0; j < Colunas; j++){
            soma++;
            matriz[i][j] = soma;
            printf("%d", matriz[i][j]);
        }
        printf("\n");
    }


    return 0;
}