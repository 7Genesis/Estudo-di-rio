#include <stdio.h>

int main(){
    int a = -10, b = -5;
    
    if (a > 0  || b > 0)
    {
        printf("pelo menos um do dois numeros positivo.\n");
    }else{
        printf("Os dois números são negativo\n");
    }
}