#include <stdio.h>

int main(){
       int idade, dependentes;
       float renda;
       

    printf("Digite a sua idade: ");
    scanf("%d", &idade);
    
    printf("Digite a sua renda: ");
    scanf("%f", &renda);

    printf("Digite quantos dependentes você tem: ");
    scanf("%d", &dependentes);

    if(idade >= 18 && idade < 65 ){
        if(renda < 3000){
            printf("Você atende aos critérios!\n");
        }else{
            printf("Você não atende ao critério renda!\n");}
            if(dependentes > 2){
                printf("Você atende a todos os critérios!\n");
            }else{
            printf("Você não atende ao critério dependentes!\n");
        }
        } else {
            printf("Você não atende ao critério idade!\n");
        }
    }
