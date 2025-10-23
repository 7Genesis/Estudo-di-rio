#include <stdio.h>

int main() {
    char Cidade1[50], Cidade2[50];
    char Estado1[50], Estado2[50];
    char Codigo1[10], Codigo2[10];
    int Populacao1, Populacao2, Numero1, Numero2;
    float PIB1, PIB2;
    float Area1, Area2;

    // Entrada da primeira cidade
    printf("Digite nome do Estado:\n");
    scanf("%49s", Estado1);

    printf("Digite o nome da Cidade:\n");
    scanf("%49s", Cidade1);

    printf("Digite o Código da Carta:\n");
    scanf("%9s", Codigo1);

    printf("Digite quantidade da população:\n");
    scanf("%d", &Populacao1);

    printf("Digite o número de pontos turísticos:\n");
    scanf("%d", &Numero1);

    printf("Digite o número do PIB:\n");
    scanf("%f", &PIB1);

    printf("Digite os KM da area:\n");
    scanf("%f", &Area1);

    // Entrada da segunda cidade
    printf("Digite nome do Estado 2:\n");
    scanf("%49s", Estado2);

    printf("Digite o nome da cidade 2:\n");
    scanf("%49s", Cidade2);

    printf("Digite o Código da Carta 2:\n");
    scanf("%9s", Codigo2);

    printf("Digite quantidade da população 2:\n");
    scanf("%d", &Populacao2);

    printf("Digite o número de pontos turísticos 2:\n");
    scanf("%d", &Numero2);

    printf("Digite o número do PIB 2:\n");
    scanf("%f", &PIB2);

    printf("Digite os KM da area 2:\n");
    scanf("%f", &Area2);

    // Exibição de dados
    printf("\nInformações da Primeira Cidade:\n");
    printf("Estado: %s\n", Estado1);
    printf("Cidade: %s\n", Cidade1);
    printf("Código: %s\n", Codigo1);
    printf("População: %d\n", Populacao1);
    printf("Pontos turísticos: %d\n", Numero1);
    printf("PIB: %.2f\n", PIB1);
    printf("Área: %.2f km²\n", Area1);

    printf("\nInformações da Segunda Cidade:\n");
    printf("Estado: %s\n", Estado2);
    printf("Cidade: %s\n", Cidade2);
    printf("Código: %s\n", Codigo2);
    printf("População: %d\n", Populacao2);
    printf("Pontos turísticos: %d\n", Numero2);
    printf("PIB: %.2f\n", PIB2);
    printf("Área: %.2f km²\n", Area2);

    return 0;
}
