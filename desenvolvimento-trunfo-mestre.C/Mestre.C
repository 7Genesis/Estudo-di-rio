#include <stdio.h>
#include <string.h>

// Estrutura para armazenar as informações da cidade
typedef struct {
    char nome[50];
    char estado[50];
    char codigo[10];
    int populacao;
    int pontosTuristicos;
    float pib;
    float area;
    float densidade;
    float perCapita;
} Cidade;

// Função para calcular os derivados
void calcularDerivados(Cidade *c) {
    if (c->area == 0 || c->populacao == 0) {
        printf("Erro: Área e População devem ser maiores que zero!\n");
        c->densidade = 0;
        c->perCapita = 0;
    } else {
        c->densidade = c->populacao / c->area;
        c->perCapita = c->pib / c->populacao;
    }
}

// Mostrar menu com base no atributo já escolhido
void mostrarMenu(int excluir) {
    printf("Escolha um atributo:\n");
    if (excluir != 1) printf("1 - População\n");
    if (excluir != 2) printf("2 - Área\n");
    if (excluir != 3) printf("3 - PIB\n");
    if (excluir != 4) printf("4 - Pontos Turísticos\n");
    if (excluir != 5) printf("5 - PIB per capita\n");
    if (excluir != 6) printf("6 - Densidade Demográfica (MENOR VENCE)\n");
}

// Retorna valor numérico baseado no atributo escolhido
float pegarValor(Cidade c, int atributo) {
    switch (atributo) {
        case 1: return c.populacao;
        case 2: return c.area;
        case 3: return c.pib;
        case 4: return c.pontosTuristicos;
        case 5: return c.perCapita;
        case 6: return c.densidade;
        default: return -1;
    }
}

// Retorna o nome do atributo
const char* nomeAtributo(int atributo) {
    switch (atributo) {
        case 1: return "População";
        case 2: return "Área";
        case 3: return "PIB";
        case 4: return "Pontos Turísticos";
        case 5: return "PIB per capita";
        case 6: return "Densidade Demográfica";
        default: return "Desconhecido";
    }
}

int main() {
    Cidade c1, c2;
    int attr1 = 0, attr2 = 0;

    // Entrada da Cidade 1
    printf("Digite o Estado da Cidade 1: ");
    scanf("%s", c1.estado);

    printf("Digite o Nome da Cidade 1: ");
    scanf("%s", c1.nome);

    printf("Digite o Código da Carta 1: ");
    scanf("%s", c1.codigo);

    printf("Digite a População da Cidade 1: ");
    scanf("%d", &c1.populacao);

    printf("Digite o Número de Pontos Turísticos da Cidade 1: ");
    scanf("%d", &c1.pontosTuristicos);

    printf("Digite o PIB da Cidade 1: ");
    scanf("%f", &c1.pib);

    printf("Digite a Área (km²) da Cidade 1: ");
    scanf("%f", &c1.area);

    // Entrada da Cidade 2
    printf("\nDigite o Estado da Cidade 2: ");
    scanf("%s", c2.estado);

    printf("Digite o Nome da Cidade 2: ");
    scanf("%s", c2.nome);

    printf("Digite o Código da Carta 2: ");
    scanf("%s", c2.codigo);

    printf("Digite a População da Cidade 2: ");
    scanf("%d", &c2.populacao);

    printf("Digite o Número de Pontos Turísticos da Cidade 2: ");
    scanf("%d", &c2.pontosTuristicos);

    printf("Digite o PIB da Cidade 2: ");
    scanf("%f", &c2.pib);

    printf("Digite a Área (km²) da Cidade 2: ");
    scanf("%f", &c2.area);

    // Cálculos
    calcularDerivados(&c1);
    calcularDerivados(&c2);

    // Escolha dos atributos
    do {
        mostrarMenu(0);
        printf("Escolha o primeiro atributo: ");
        scanf("%d", &attr1);
        if (attr1 < 1 || attr1 > 6) {
            printf("Opção inválida!\n");
        }
    } while (attr1 < 1 || attr1 > 6);

    do {
        mostrarMenu(attr1);
        printf("Escolha o segundo atributo (diferente do primeiro): ");
        scanf("%d", &attr2);
        if (attr2 < 1 || attr2 > 6 || attr2 == attr1) {
            printf("Opção inválida!\n");
        }
    } while (attr2 < 1 || attr2 > 6 || attr2 == attr1);

    // Comparação dos atributos
    float valor1_attr1 = pegarValor(c1, attr1);
    float valor2_attr1 = pegarValor(c2, attr1);
    float valor1_attr2 = pegarValor(c1, attr2);
    float valor2_attr2 = pegarValor(c2, attr2);

    int pontosC1 = 0, pontosC2 = 0;

    // Comparar primeiro atributo
    if (attr1 == 6) { // densidade: menor vence
        (valor1_attr1 < valor2_attr1) ? pontosC1++ : pontosC2++;
    } else {
        (valor1_attr1 > valor2_attr1) ? pontosC1++ : pontosC2++;
    }

    // Comparar segundo atributo
    if (attr2 == 6) {
        (valor1_attr2 < valor2_attr2) ? pontosC1++ : pontosC2++;
    } else {
        (valor1_attr2 > valor2_attr2) ? pontosC1++ : pontosC2++;
    }

    // Soma dos valores dos atributos
    float soma1 = valor1_attr1 + valor1_attr2;
    float soma2 = valor2_attr1 + valor2_attr2;

    // Resultado final
    printf("\n--- RESULTADO DA COMPARAÇÃO ---\n");
    printf("Cidade 1: %s (%s)\n", c1.nome, c1.estado);
    printf("Cidade 2: %s (%s)\n", c2.nome, c2.estado);

    printf("\nAtributo 1: %s\n", nomeAtributo(attr1));
    printf("  %s: %.2f\n", c1.nome, valor1_attr1);
    printf("  %s: %.2f\n", c2.nome, valor2_attr1);

    printf("\nAtributo 2: %s\n", nomeAtributo(attr2));
    printf("  %s: %.2f\n", c1.nome, valor1_attr2);
    printf("  %s: %.2f\n", c2.nome, valor2_attr2);

    printf("\nSoma dos atributos:\n");
    printf("  %s: %.2f\n", c1.nome, soma1);
    printf("  %s: %.2f\n", c2.nome, soma2);

    printf("\nResultado final:\n");
    if (soma1 > soma2) {
        printf("🏆 %s venceu!\n", c1.nome);
    } else if (soma2 > soma1) {
        printf("🏆 %s venceu!\n", c2.nome);
    } else {
        printf("⚖️  Empate!\n");
    }

    return 0;
}
