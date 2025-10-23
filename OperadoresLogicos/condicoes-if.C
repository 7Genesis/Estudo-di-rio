#include <stdio.h>

int main(){
    int idade;
    float renda;
    //ter desconto tem que ter mais de 60 anos ou menos de 18 anos e ter uma renda mensal abaixo de 2000
    printf("Digite a sua idade: ");
    scanf("%d", &idade);
    
    printf("Digite a sua renda: ");
    scanf("%f", &renda);

    if(idade >= 60 || idade <= 18 && renda <= 2000 ){
        printf("Você tem direito ao desconto devido as condições!\n");
    }else if(renda > 2000){
            printf("Você não tem direito ao desconto devido a renda!\n");
    }else{
        printf("Você não tem direito ao desconto devido a idade!\n");
    }
}