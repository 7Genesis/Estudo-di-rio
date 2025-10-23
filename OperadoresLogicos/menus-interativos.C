#include <stdio.h>

int main(){
    int opcao;
printf("Menu principal\n");
printf("1. Iniciar jogo\n");
printf("2. Ver regras\n");
printf("3. Sair\n");
printf("Escola uma das opções: ");
scanf("%d", &opcao);

switch (opcao)
{
case 1:
    printf("Execução do jogo\n");
    break;
case 2:
    printf("As regras são .....\n");
    break;
case 3:
    printf("Saindo do jogo\n");
    break;
default:
    printf("Opção invalida!\n");
    break;
    }
}