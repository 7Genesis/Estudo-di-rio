#include <stdio.h>

int main(){

    char *letras[10]= {"A" , "B" , "C" , "D" ,"E" ,"F" ,"G" , "H" ,"I" ,"J"};
    int tabuleiro [10][10]= 
    {
        {0,0,0,0,0,0,0,0,0,0},
        {0,0,0,0,0,0,0,0,0,0},
        {0,0,0,3,3,3,0,0,0,0},
        {0,0,0,0,0,0,0,0,0,0},
        {0,0,0,0,0,0,0,0,0,0},
        {0,0,0,0,0,0,0,3,0,0},
        {0,0,0,0,0,0,0,3,0,0},
        {0,0,0,0,0,0,0,3,0,0},
        {0,0,0,0,0,0,0,0,0,0},
        {0,0,0,0,0,0,0,0,0,0}
    };

    printf("         Tabuleiro Naval    \n");
    printf("   ");
    for (int c = 0; c < 10; c++) 
    {
        printf(" %s ", letras[c]);
    }
    printf("\n");

    for (int i = 0; i < 10; i++) {
        printf("%2d ", i + 1);
        for (int j = 0; j < 10; j++) {
            printf(" %d ", tabuleiro[i][j]);
        }
        printf("\n");
    }
        return 0;
    
}
