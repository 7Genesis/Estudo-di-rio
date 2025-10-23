#include <stdio.h>

int main(){
    int idade;
    float altura;
    char opcao;
    char nome[20];
    // sintaxe scanf
    //scanf("formato1""formato2, &variavel1,variavel2, ... ")

printf("Digite a sua idade:");
scanf("%d", &idade);
printf("idade é: %d\n", idade);

printf("Digite a sua altura:");
scanf("%f", &altura);
printf("A altura é: %f\n", altura);

printf("Digite a opcao:\n");
scanf(" %c", &opcao);
printf("O nome é: %c", opcao);

/*
print("%formato1 %formato2 %formato3", variavel1, variavel2, variavel3)
%d: imprime um inteiro no formato decimal.
%i: Equivalente a %d
*/
}