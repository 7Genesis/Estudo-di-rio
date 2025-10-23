#include <stdio.h>

int main(){
    int variavel;
    
    printf("Digite o valor: ");
    scanf("%d", &variavel);

    switch (variavel)
    {
    case 1:
        printf("Código a ser executado se a variavel == 1\n");
        printf("Teste do case1");
        break;
    case 2:
        printf("Código a ser executado se variavel == 2\n");
    break;
    default:
    printf("Código a ser e xecutado se a variavel não for 1 ou 2\n");
        
    }
}