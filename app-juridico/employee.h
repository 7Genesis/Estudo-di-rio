#ifndef EMPLOYEE_H
#define EMPLOYEE_H

#include <stddef.h>

#define MAX_EMPLOYEES 100
#define MAX_NAME 50

typedef struct {
    int id;
    char name[MAX_NAME];
    char position[MAX_NAME];
    float salary;
    char status[20];
} Employee;

/* inicializa o sistema */
void initEmployeeSystem(void);

/* operações CRUD simples */
void addEmployee(void);
void listEmployees(void);
void searchEmployee(void);
void removeEmployee(void);

/* nova função: dashboard */
void showDashboard(void);

#endif /* EMPLOYEE_H */