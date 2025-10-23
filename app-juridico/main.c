#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "employee.h"

void clearInputBuffer() {
    int c;
    while ((c = getchar()) != '\n' && c != EOF);
}

void clearScreen() {
#ifdef _WIN32
    system("cls");
#else
    /* tenta usar clear; se não disponível, usa escape ANSI */
    if (system("clear") != 0) {
        printf("\x1b[2J\x1b[H");
    }
#endif
}

static void pause_enter() {
    char buf[2];
    printf("Pressione ENTER para continuar...");
    fgets(buf, sizeof(buf), stdin);
}

static int read_int(const char *prompt) {
    char buf[128];
    int val;
    while (1) {
        printf("%s", prompt);
        if (!fgets(buf, sizeof(buf), stdin)) return 0;
        if (sscanf(buf, "%d", &val) == 1) return val;
        printf("Entrada inválida. Tente novamente.\n");
    }
}

int main() {
    int choice;
    char buf[128];

    do {
        clearScreen();
        printf("=== Sistema de Gestão de Funcionários ===\n");
        printf("\nMenu Principal:\n");
        printf("1. Adicionar Funcionário\n");
        printf("2. Listar Funcionários\n");
        printf("3. Buscar Funcionário\n");
        printf("4. Remover Funcionário\n");
        printf("5. Dashboard\n");
        printf("0. Sair\n\n");

        choice = read_int("Escolha uma opção: ");

        switch(choice) {
            case 5:
                showDashboard();
                break;
             case 0:
                printf("\nDeseja realmente sair? (s/n): ");
                if (!fgets(buf, sizeof(buf), stdin)) { choice = -1; break; }
                if (buf[0] == 's' || buf[0] == 'S') {
                    choice = 0;
                } else {
                    choice = -1;
                }
                break;
            case 1:
                addEmployee();
                break;
            case 2:
                listEmployees();
                break;
            case 3:
                searchEmployee();
                break;
            case 4:
                removeEmployee();
                break;
            default:
                printf("\nOpção inválida! Digite um número entre 0 e 5.\n");
                break;
        }

        if (choice != 0) pause_enter();
    } while (choice != 0);

    printf("\nObrigado por usar o sistema!\n");
    return 0;
}

<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Download - Hub Evoluti 360°</title>
  <style>
    body { font-family: Arial; max-width: 800px; margin: 50px auto; padding: 20px; }
    .download-btn { 
      display: inline-block; 
      padding: 15px 30px; 
      margin: 10px; 
      background: #1976d2; 
      color: white; 
      text-decoration: none; 
      border-radius: 5px; 
      font-size: 18px;
    }
    .download-btn:hover { background: #1565c0; }
  </style>
</head>
<body>
  <h1>🚀 Download Hub Evoluti 360°</h1>
  <p>Sistema de gestão de RH e funcionários</p>
  
  <h2>📱 Acesso via navegador (recomendado)</h2>
  <a href="https://seuapp.netlify.app" class="download-btn">Abrir App Web</a>
  <p><small>Funciona em qualquer dispositivo com internet. Instalável no celular.</small></p>
  
  <h2>💻 Download Desktop</h2>
  <a href="LINK_DO_GOOGLE_DRIVE_MAC" class="download-btn">macOS (M1/M2)</a>
  <a href="LINK_DO_GOOGLE_DRIVE_WINDOWS" class="download-btn">Windows</a>
  <a href="LINK_DO_GOOGLE_DRIVE_LINUX" class="download-btn">Linux</a>
  
  <h2>📖 Instruções</h2>
  <ul>
    <li><strong>Web:</strong> Abra o link e clique em "Instalar app" (celular) ou use direto no navegador</li>
    <li><strong>macOS:</strong> Baixe o .dmg → Arraste para Aplicativos → Abra (⌘+Espaço → digite o nome)</li>
    <li><strong>Windows:</strong> Baixe o .exe → Execute → Próximo → Instalar</li>
  </ul>
</body>
</html>