#include <stdio.h>
#include <stdlib.h>
#include <time.h>

int main() {
    char board[3][3] = { {'1','2','3'}, {'4','5','6'}, {'7','8','9'} };
    int choice, row, col;
    char player = 'X', computer = 'O';
    int moves = 0;

    srand(time(NULL)); // Inicializa o gerador de números aleatórios

    while (1) {
        // Exibe o tabuleiro
        printf("\n");
        for (int i = 0; i < 3; i++) {
            for (int j = 0; j < 3; j++) {
                printf(" %c ", board[i][j]);
                if (j < 2) printf("|");
            }
            printf("\n");
            if (i < 2) printf("---|---|---\n");
        }

        // Jogada do jogador
        printf("Escolha uma posiçao (1-9): ");
        scanf("%d", &choice);
        row = (choice - 1) / 3;
        col = (choice - 1) % 3;

        if (choice < 1 || choice > 9 || board[row][col] == 'X' || board[row][col] == 'O') {
            printf("Movimento inválido! Tente novamente.\n");
            continue;
        }

        board[row][col] = player;
        moves++;

        // Verifica vitória ou empate do jogador
        for (int i = 0; i < 3; i++) {
            if ((board[i][0] == player && board[i][1] == player && board[i][2] == player) ||
                (board[0][i] == player && board[1][i] == player && board[2][i] == player)) {
                printf("Você venceu!\n");
                return 0;
            }
        }
        if ((board[0][0] == player && board[1][1] == player && board[2][2] == player) ||
            (board[0][2] == player && board[1][1] == player && board[2][0] == player)) {
            printf("Você venceu!\n");
            return 0;
        }
        if (moves == 9) {
            printf("Empate!\n");
            return 0;
        }

        // Jogada do computador
        do {
            choice = rand() % 9 + 1;
            row = (choice - 1) / 3;
            col = (choice - 1) % 3;
        } while (board[row][col] == 'X' || board[row][col] == 'O');
        board[row][col] = computer;
        moves++;
        printf("Computador escolheu a posiçao %d\n", choice);

        // Verifica vitória ou empate do computador
        for (int i = 0; i < 3; i++) {
            if ((board[i][0] == computer && board[i][1] == computer && board[i][2] == computer) ||
                (board[0][i] == computer && board[1][i] == computer && board[2][i] == computer)) {
                printf("Computador venceu!\n");
                return 0;
            }
        }
        if ((board[0][0] == computer && board[1][1] == computer && board[2][2] == computer) ||
            (board[0][2] == computer && board[1][1] == computer && board[2][0] == computer)) {
            printf("Computador venceu!\n");
            return 0;
        }
        if (moves == 9) {
            printf("Empate!\n");
            return 0;
        }
    }
    return 0;
}