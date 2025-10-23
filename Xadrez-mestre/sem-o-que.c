#include <stdio.h>

int main() {
    
    char nome[50];
    int idade;
    char cidade[50];
    char estado[50];
    char pais[50];
    char profissao[50];
    char data_nascimento[20];
    char endereco[100];
    char telefone[20];
    char email[50]; 

    printf("digite seu nome\n");
    scanf("%49s",&nome);
    printf("\n");
    printf("Digite sua idade\n");
    scanf("%d", &idade);
    printf("\n");
    printf("Digite sua cidade\n");
    scanf("%49s", cidade);
    printf("\n");
    printf("Digite seu estado\n");
    scanf("%49s", estado);
    printf("\n");
    printf("Digite seu país\n");
    scanf("%49s", pais);
    printf("\n");
    printf("Digite sua profissão\n");
    scanf("%49s", profissao);
    printf("\n");
    printf("Digite sua data de nascimento\n");
    scanf("%19s", data_nascimento);
    printf("\n");
    printf("Digite seu endereço\n");
    scanf("%99s", endereco);
    printf("\n");
    printf("Digite seu telefone\n");
    scanf("%19s", telefone);
    printf("\n");
    printf("Digite seu e-mail\n");
    scanf("%49s", email);

    printf("\n--- Informações Coletadas ---\n");

    printf("Nome: %s\n", nome);
    printf("\n");
    printf("Idade: %d\n", idade);
    printf("\n");
    printf("Cidade: %s\n", cidade);
    printf("\n");
    printf("Estado: %s\n", estado);
    printf("\n");
    printf("País: %s\n", pais);
    printf("\n");
    printf("Profissão: %s\n", profissao);
    printf("\n");
    printf("Data de Nascimento: %s\n", data_nascimento);
    printf("\n");
    printf("Endereço: %s\n", endereco);
    printf("\n");
    printf("Telefone: %s\n", telefone);
    printf("\n");
    printf("E-mail: %s\n", email);

    return 0;
}