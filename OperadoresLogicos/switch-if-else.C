#include <stdio.h>

int main(){
    int dia;

    printf("Entre com o valor do dia: \n");
    scanf("%d", &dia);

    if(dia == 1){
        printf("Domingo\n");
    }else if(dia == 2){
        printf("Segunda-feira\n");
    }else if(dia == 3){
        printf("Terça-feira\n");
    }else if(dia == 4){
        printf("Quarta-feira\n");
    }else if(dia == 5){
        printf("Quinta-feira\n");
    }else if(dia == 6){
        printf("Sexta-feira\n");
    }else{
        printf("Sábado\n");
    }
}