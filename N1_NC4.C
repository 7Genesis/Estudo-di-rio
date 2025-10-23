#include <stdio.h>

int main(){
    int idade = 26;
    float altura = 1.79;
    char opçao = 'G';
    char nome[20] = "Gênesis";
    printf("A idade do %s é: %d\n", nome, idade);
    printf("A altura é : %.2f\n", altura);
    printf("A opção é :%c\n", opçao);


    /*
    printf("%formato1 %formato2 %formato3", variavel1, variavel2, variavel3)
    %d: Imprime um inteiro no formato decimal.
    %i: Equivalente a %d
    %f: Imprime um número de ponto flutuante do formato padrão.
    %e: imprime um número de ponto flutuante na notação cientifica.
    %c: Imprime uma cadeia (string) de caracteres.
    */
}