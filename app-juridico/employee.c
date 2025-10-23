#include <stdio.h>
#include <string.h>
#include "employee.h"

static Employee employees[MAX_EMPLOYEES];
static int employeeCount = 0;

void initEmployeeSystem(void) {
    employeeCount = 0;
    for (int i = 0; i < MAX_EMPLOYEES; ++i) {
        employees[i].id = 0;
        employees[i].name[0] = '\0';
        employees[i].position[0] = '\0';
        employees[i].salary = 0.0f;
        employees[i].status[0] = '\0';
    }
}

void addEmployee(void) {
    if (employeeCount >= MAX_EMPLOYEES) {
        printf("Erro: sistema lotado.\n");
        return;
    }

    Employee emp;
    emp.id = (employeeCount == 0) ? 1 : employees[employeeCount - 1].id + 1;

    printf("Nome: ");
    if (!fgets(emp.name, sizeof(emp.name), stdin)) return;
    emp.name[strcspn(emp.name, "\n")] = '\0';

    printf("Cargo: ");
    if (!fgets(emp.position, sizeof(emp.position), stdin)) return;
    emp.position[strcspn(emp.position, "\n")] = '\0';

    printf("Salário: ");
    if (scanf("%f", &emp.salary) != 1) {
        printf("Entrada inválida para salário.\n");
        /* limpar buffer */
        int c; while ((c = getchar()) != '\n' && c != EOF);
        return;
    }
    int c; while ((c = getchar()) != '\n' && c != EOF);

    strcpy(emp.status, "Ativo");

    employees[employeeCount++] = emp;
    printf("Funcionário adicionado com sucesso (ID=%d)!\n", emp.id);
}

void listEmployees(void) {
    if (employeeCount == 0) {
        printf("Nenhum funcionário cadastrado.\n");
        return;
    }

    printf("\nID\tNome\tCargo\tSalário\tStatus\n");
    for (int i = 0; i < employeeCount; ++i) {
        printf("%d\t%s\t%s\t%.2f\t%s\n",
               employees[i].id,
               employees[i].name,
               employees[i].position,
               employees[i].salary,
               employees[i].status);
    }
}

void searchEmployee(void) {
    if (employeeCount == 0) {
        printf("Nenhum funcionário cadastrado.\n");
        return;
    }

    int searchId;
    printf("Digite o ID do funcionário: ");
    if (scanf("%d", &searchId) != 1) {
        int c; while ((c = getchar()) != '\n' && c != EOF);
        printf("Entrada inválida.\n");
        return;
    }
    int c; while ((c = getchar()) != '\n' && c != EOF);

    for (int i = 0; i < employeeCount; ++i) {
        if (employees[i].id == searchId) {
            printf("Funcionário encontrado:\n");
            printf("ID: %d\nNome: %s\nCargo: %s\nSalário: %.2f\nStatus: %s\n",
                   employees[i].id,
                   employees[i].name,
                   employees[i].position,
                   employees[i].salary,
                   employees[i].status);
            return;
        }
    }
    printf("Funcionário não encontrado.\n");
}

void removeEmployee(void) {
    if (employeeCount == 0) {
        printf("Nenhum funcionário cadastrado.\n");
        return;
    }

    int removeId;
    printf("Digite o ID do funcionário a ser removido: ");
    if (scanf("%d", &removeId) != 1) {
        int c; while ((c = getchar()) != '\n' && c != EOF);
        printf("Entrada inválida.\n");
        return;
    }
    int c; while ((c = getchar()) != '\n' && c != EOF);

    for (int i = 0; i < employeeCount; ++i) {
        if (employees[i].id == removeId) {
            for (int j = i; j < employeeCount - 1; ++j) {
                employees[j] = employees[j + 1];
            }
            --employeeCount;
            printf("Funcionário removido com sucesso.\n");
            return;
        }
    }
    printf("Funcionário não encontrado.\n");
}

void showDashboard(void) {
    if (employeeCount == 0) {
        printf("Nenhum funcionário cadastrado.\n");
        return;
    }

    int ativo = 0, inativo = 0, ferias = 0;
    double totalSalario = 0.0;
    double minSal = employees[0].salary;
    double maxSal = employees[0].salary;

    for (int i = 0; i < employeeCount; ++i) {
        totalSalario += employees[i].salary;
        if (employees[i].salary < minSal) minSal = employees[i].salary;
        if (employees[i].salary > maxSal) maxSal = employees[i].salary;

        if (strcmp(employees[i].status, "Ativo") == 0) ++ativo;
        else if (strcmp(employees[i].status, "Inativo") == 0) ++inativo;
        else if (strcmp(employees[i].status, "Férias") == 0 || strcmp(employees[i].status, "Ferias") == 0) ++ferias;
    }

    double media = totalSalario / (double)employeeCount;

    printf("\n=== Dashboard ===\n");
    printf("Total de funcionários: %d\n", employeeCount);
    printf("Média salarial: R$ %.2f\n", media);
    printf("Maior salário: R$ %.2f\n", maxSal);
    printf("Menor salário: R$ %.2f\n", minSal);
    printf("Por status: Ativo=%d  Inativo=%d  Férias=%d\n", ativo, inativo, ferias);

    /* top 3 salários (índices selecionados) */
    int topIdx[3] = {-1, -1, -1};
    for (int k = 0; k < 3; ++k) {
        double best = -1.0;
        int besti = -1;
        for (int i = 0; i < employeeCount; ++i) {
            int already = 0;
            for (int j = 0; j < k; ++j) if (topIdx[j] == i) { already = 1; break; }
            if (already) continue;
            if (employees[i].salary > best) { best = employees[i].salary; besti = i; }
        }
        topIdx[k] = besti;
    }

    printf("\nTop %d maiores salários:\n", (employeeCount < 3) ? employeeCount : 3);
    for (int i = 0; i < 3; ++i) {
        int idx = topIdx[i];
        if (idx == -1) break;
        printf("%d) ID:%d %s — R$ %.2f\n", i+1, employees[idx].id, employees[idx].name, employees[idx].salary);
    }
    printf("=================\n");
}