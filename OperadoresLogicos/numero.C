#include <stdio.h>

int main(){
    int numero;

    printf("Digite seu número: ");
    scanf("%d", &numero);

    if(numero > 0){
        if(numero % 2 == 0){
            printf("Número é par!\n");
        }else{
            printf("Número é impar!\n");
        }
        printf("Positivo!\n");
    }else if(numero == 0){
        printf("Número é zero!\n");
    }else{
        printf("Numero é negativo!\n");
    }
}