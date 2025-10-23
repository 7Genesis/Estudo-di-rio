#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    int escolha_jogador, escolha_computador;
    // Inicializa o gerador de números aleatórios
    srand(time(NULL));

    printf("=== JOKENPO ===\n");
    printf("Escolha uma opção:\n");
    printf("1. Pedra\n");
    printf("2. Papel\n");
    printf("3. Tesoura\n");
    printf("Digite sua escolha (1-3): ");
    scanf("%d", &escolha_jogador);

    // Validação da entrada
    if (escolha_jogador < 1 || escolha_jogador > 3) {
        printf("Escolha inválida! Digite 1, 2 ou 3.\n");
        return 1;
    }

    // Lógica para a escolha do computador
    escolha_computador = rand() % 3 + 1;

    // Mostra as escolhas com texto
    printf("\nSua escolha: ");
    switch(escolha_jogador) {
        case 1: printf("Pedra\n"); break;
        case 2: printf("Papel\n"); break;
        case 3: printf("Tesoura\n"); break;
    }

    printf("Computador escolheu: ");
    switch(escolha_computador) {
        case 1: printf("Pedra\n"); break;
        case 2: printf("Papel\n"); break;
        case 3: printf("Tesoura\n"); break;
    }

    // Lógica para determinar o vencedor
    if (escolha_jogador == escolha_computador) {
        printf("\nEmpate!\n");
    } else if ((escolha_jogador == 1 && escolha_computador == 3) ||
               (escolha_jogador == 2 && escolha_computador == 1) ||
               (escolha_jogador == 3 && escolha_computador == 2)) {
        printf("\nVocê venceu!\n");
    } else {
        printf("\nVocê perdeu!\n");
    }

    return 0;
}