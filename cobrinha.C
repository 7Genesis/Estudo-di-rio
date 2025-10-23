#include <stdio.h>
#include <stdlib.h>
#include <time.h>
#include <unistd.h>
#include <termios.h>
#include <sys/select.h>

#define LARGURA 20
#define ALTURA 20
#define MAXTAIL 100

static struct termios orig_termios;

void disableRawMode() {
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &orig_termios);
}

void enableRawMode() {
    tcgetattr(STDIN_FILENO, &orig_termios);
    atexit(disableRawMode);
    struct termios raw = orig_termios;
    raw.c_lflag &= ~(ECHO | ICANON);
    raw.c_cc[VMIN] = 0;
    raw.c_cc[VTIME] = 0;
    tcsetattr(STDIN_FILENO, TCSAFLUSH, &raw);
}

int kbhit() {
    struct timeval tv = {0, 0};
    fd_set fds;
    FD_ZERO(&fds);
    FD_SET(STDIN_FILENO, &fds);
    return select(STDIN_FILENO + 1, &fds, NULL, NULL, &tv) > 0;
}

int gameover = 0;
int score = 0;
int x, y, frutaX, frutaY, flag;
int tailX[MAXTAIL], tailY[MAXTAIL];
int nTail = 0;

void placeFruit() {
    do {
        frutaX = rand() % (LARGURA - 2) + 1; // evita borda
        frutaY = rand() % (ALTURA - 2) + 1;
    } while (frutaX == x && frutaY == y);
}

void setup() {
    srand(time(NULL));
    gameover = 0;
    x = LARGURA / 2;
    y = ALTURA / 2;
    flag = 0;
    score = 0;
    nTail = 0;
    for (int i = 0; i < MAXTAIL; i++) tailX[i] = tailY[i] = -1;
    placeFruit();
}

void clearScreen() {
    printf("\x1b[2J\x1b[H");
}

void draw() {
    clearScreen();
    for (int i = 0; i < ALTURA; i++) {
        for (int j = 0; j < LARGURA; j++) {
            if (i == 0 || i == ALTURA - 1 || j == 0 || j == LARGURA - 1) {
                putchar('#');
            } else if (j == x && i == y) {
                putchar('O');
            } else if (j == frutaX && i == frutaY) {
                putchar('F');
            } else {
                int ch = 0;
                for (int k = 0; k < nTail; k++) {
                    if (tailX[k] == j && tailY[k] == i) {
                        putchar('o');
                        ch = 1;
                        break;
                    }
                }
                if (!ch) putchar(' ');
            }
        }
        putchar('\n');
    }
    printf("Score = %d\n", score);
    printf("Use WASD para mover. Pressione X para sair.\n");
    fflush(stdout);
}

void input() {
    if (kbhit()) {
        int c = getchar();
        if (c == 'a' || c == 'A') flag = 1; // left
        else if (c == 'd' || c == 'D') flag = 2; // right
        else if (c == 'w' || c == 'W') flag = 3; // up
        else if (c == 's' || c == 'S') flag = 4; // down
        else if (c == 'x' || c == 'X') gameover = 1;
    }
}

void logic() {
    int prevX = tailX[0];
    int prevY = tailY[0];
    int prev2X, prev2Y;
    tailX[0] = x;
    tailY[0] = y;
    for (int i = 1; i < nTail; i++) {
        prev2X = tailX[i];
        prev2Y = tailY[i];
        tailX[i] = prevX;
        tailY[i] = prevY;
        prevX = prev2X;
        prevY = prev2Y;
    }

    if (flag == 1) x--;       // left
    else if (flag == 2) x++;  // right
    else if (flag == 3) y--;  // up
    else if (flag == 4) y++;  // down

    // colisão com parede
    if (x <= 0 || x >= LARGURA - 1 || y <= 0 || y >= ALTURA - 1) {
        gameover = 1;
    }

    // colisão com cauda
    for (int i = 0; i < nTail; i++) {
        if (tailX[i] == x && tailY[i] == y) gameover = 1;
    }

    // comer fruta
    if (x == frutaX && y == frutaY) {
        score += 10;
        if (nTail < MAXTAIL) {
            tailX[nTail] = prevX;
            tailY[nTail] = prevY;
            nTail++;
        }
        placeFruit();
    }
}

int main() {
    enableRawMode();
    setup();
    while (!gameover) {
        draw();
        input();
        logic();
        usleep(80000); // ajusta velocidade
    }
    disableRawMode();
    clearScreen();
    printf("Game Over! Score final = %d\n", score);
    return 0;
}