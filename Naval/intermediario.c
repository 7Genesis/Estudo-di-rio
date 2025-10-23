#include <stdio.h>

#define TAM 10   // tamanho do tabuleiro
#define NAVIO 3  // valor que representa navios
#define AGUA 0   // valor que representa água

int main() {

    // Cabeçalhos das colunas (A a J)
    char *letras[TAM] = {"A","B","C","D","E","F","G","H","I","J"};
    int tabuleiro[TAM][TAM] = {0};  // inicializa todo o tabuleiro com 0 (água)

    // ------------------------------
    // POSICIONAMENTO DOS NAVIOS
    // ------------------------------

    // Navio 1 - horizontal (linha 2, colunas 3–5)
    for (int j = 3; j < 6; j++) {
        tabuleiro[2][j] = NAVIO;
    }

    // Navio 2 - vertical (coluna 7, linhas 5–7)
    for (int i = 5; i < 8; i++) {
        tabuleiro[i][7] = NAVIO;
    }

    // Navio 3 - diagonal principal (↘) começando em (0,0)
    for (int i = 0; i < 3; i++) {
        tabuleiro[i][i] = NAVIO;
    }

    // Navio 4 - diagonal secundária (↙) começando em (7,2)
    for (int k = 0; k < 3; k++) {
        tabuleiro[7 + k][2 - k] = NAVIO;
    }

    // ------------------------------
    // IMPRESSÃO DO TABULEIRO
    // ------------------------------

    printf("\n         === TABULEIRO NAVAL ===\n\n   ");
    for (int c = 0; c < TAM; c++) {
        printf(" %s ", letras[c]);
    }
    printf("\n");

    for (int i = 0; i < TAM; i++) {
        printf("%2d ", i + 1);
        for (int j = 0; j < TAM; j++) {
            if (tabuleiro[i][j] == AGUA)
                printf(" ~ ");  // símbolo de água
            else
                printf(" # ");  // símbolo de navio
        }
        printf("\n");
    }

    printf("\nLegenda: ~ = água | # = navio\n");
    printf("Foram posicionados 4 navios (2 horizontais/verticais e 2 diagonais).\n");

    return 0;
}
