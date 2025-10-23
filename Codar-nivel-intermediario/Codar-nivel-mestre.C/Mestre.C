#include <stdio.h>

int main() {
    char Cidade1[50], Cidade2[50];
    char Estado1[50], Estado2[50];
    char Codigo1[10], Codigo2[10];
    int Populacao1, Populacao2, Numero1, Numero2;
    float PIB1, PIB2;
    float Area1, Area2;
    float Densidade1, Densidade2;
    float Capita1, Capita2;
    float SuperPoder1, SuperPoder2;

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

    printf("Digite os KM da área:\n");
    scanf("%f", &Area1);

    // Entrada da segunda cidade
    printf("Digite nome do Estado 2:\n");
    scanf("%49s", Estado2);

    printf("Digite o nome da Cidade 2:\n");
    scanf("%49s", Cidade2);

    printf("Digite o Código da Carta 2:\n");
    scanf("%9s", Codigo2);

    printf("Digite quantidade da população 2:\n");
    scanf("%d", &Populacao2);

    printf("Digite o número de pontos turísticos 2:\n");
    scanf("%d", &Numero2);

    printf("Digite o número do PIB 2:\n");
    scanf("%f", &PIB2);

    printf("Digite os KM da área 2:\n");
    scanf("%f", &Area2);

    // Cálculos
    Densidade1 = Populacao1 / Area1;
    Capita1 = PIB1 / Populacao1;
    SuperPoder1 = Populacao1 + Area1 + PIB1 + Numero1 + Capita1 + (1 / Densidade1);

    Densidade2 = Populacao2 / Area2;
    Capita2 = PIB2 / Populacao2;
    SuperPoder2 = Populacao2 + Area2 + PIB2 + Numero2 + Capita2 + (1 / Densidade2);

    // Exibição
    printf("\n--- INFORMAÇÕES DA CIDADE 1 ---\n");
    printf("Estado: %s\n", Estado1);
    printf("Cidade: %s\n", Cidade1);
    printf("Código: %s\n", Codigo1);
    printf("População: %d\n", Populacao1);
    printf("Área: %.2f km²\n", Area1);
    printf("PIB: %.2f\n", PIB1);
    printf("Pontos turísticos: %d\n", Numero1);
    printf("Densidade Populacional: %.2f\n", Densidade1);
    printf("PIB per capita: %.2f\n", Capita1);
    printf("Super Poder: %.2f\n", SuperPoder1);

    printf("\n--- INFORMAÇÕES DA CIDADE 2 ---\n");
    printf("Estado: %s\n", Estado2);
    printf("Cidade: %s\n", Cidade2);
    printf("Código: %s\n", Codigo2);
    printf("População: %d\n", Populacao2);
    printf("Área: %.2f km²\n", Area2);
    printf("PIB: %.2f\n", PIB2);
    printf("Pontos turísticos: %d\n", Numero2);
    printf("Densidade Populacional: %.2f\n", Densidade2);
    printf("PIB per capita: %.2f\n", Capita2);
    printf("Super Poder: %.2f\n", SuperPoder2);

    // Comparações (1 = carta 1 vence; 0 = carta 2 vence)
    int vitorias1 = 0, vitorias2 = 0;
    int resultado;

    printf("\n--- RESULTADO DAS COMPARAÇÕES ---\n");

    resultado = Populacao1 > Populacao2 ? 1 : 0;
    printf("População: %d\n", resultado);
    resultado == 1 ? vitorias1++ : vitorias2++;

    resultado = Area1 > Area2 ? 1 : 0;
    printf("Área: %d\n", resultado);
    resultado == 1 ? vitorias1++ : vitorias2++;

    resultado = PIB1 > PIB2 ? 1 : 0;
    printf("PIB: %d\n", resultado);
    resultado == 1 ? vitorias1++ : vitorias2++;

    resultado = Numero1 > Numero2 ? 1 : 0;
    printf("Pontos Turísticos: %d\n", resultado);
    resultado == 1 ? vitorias1++ : vitorias2++;

    resultado = Capita1 > Capita2 ? 1 : 0;
    printf("PIB per capita: %d\n", resultado);
    resultado == 1 ? vitorias1++ : vitorias2++;

    resultado = Densidade1 < Densidade2 ? 1 : 0; // menor vence
    printf("Densidade (menor vence): %d\n", resultado);
    resultado == 1 ? vitorias1++ : vitorias2++;

    resultado = SuperPoder1 > SuperPoder2 ? 1 : 0;
    printf("Super Poder: %d\n", resultado);
    resultado == 1 ? vitorias1++ : vitorias2++;

    // Resultado final
    printf("\n--- RESULTADO FINAL ---\n");
    printf("Vitórias da Carta 1: %d\n", vitorias1);
    printf("Vitórias da Carta 2: %d\n", vitorias2);

    if (vitorias1 > vitorias2) {
        printf("🏆 Carta 1 VENCEU!\n");
    } else if (vitorias2 > vitorias1) {
        printf("🏆 Carta 2 VENCEU!\n");
    }

    return 0;
}
