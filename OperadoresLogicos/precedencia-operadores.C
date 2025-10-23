#include <stdio.h>

int main(){
    int a = -5;
    int b = 10;
    int c = 1;

    // a > 0 -> Verdadeira
    // b < 0 -> Verdadeira
    //  Verdadeiro && Verdadeiro -> Verdadeiro
    // Verdadeiro || c == 0
    // Verdadeiro || Falso -> Verdaeiro




    if (a > 0 && b || c == 0){
        printf("A condição é verdadeira\n");
    }else{
        printf("A condição é falsa\n");
    }
    return 0;

}