#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
  int opcao, regras;
  int numeroSecreto, palpite;

  printf("Menu Principal\n");
  printf("1. Iniciar Jogo\n");
  printf("2. Ver Regras\n");
  printf("3. Sair\n");
  printf("Escolha uma opção: \n");
  scanf("%d", &opcao);

 switch (opcao)
 {
 case 1:
    srand(time(0));
    numeroSecreto = rand() % 11;
    printf("Digite um número de 0 a 10: \n");
    scanf("%d", &palpite);
    if(numeroSecreto == palpite){
        printf("Você acertou!\n");
    }else{
        printf("Você errou!\n");
    }
    printf("Numero secreto %d\n", numeroSecreto);
    break;
 case 2:
 printf("A explicação das regras.\n");
 printf("Digite a opção relacionadas as regras do jogo!\n");
 scanf("%d",&regras);
 switch (regras)
 {
 case 1:
    printf("Regras 1!\n");
    break;
 case 2:
    printf("Regras 2!\n");
 break;
 
 default:
 printf("Opção invalida!\n");
    break;
 }
 
 break;
 case 3:
printf("Saindo do jogo.\n");
 break;

 default:
 printf("Opção invalida!\n");
    break;
 }
}