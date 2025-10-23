#include <stdio.h>


int main () {
    int numeroNormal = 2147483647; // Valor máximo de int
    long long int numeroGrande = 214748367;

    printf("Número regular (int): %d\n", numeroNormal);
    printf("Número grande (long int): %lld\n", numeroGrande);

    numeroGrande = 2147483648; //Valor maior que o máximo de int
    printf("Número grande atualizado (long int): %ld\n", numeroGrande);

    return 0;
}