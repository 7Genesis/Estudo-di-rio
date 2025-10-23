#include <stdio.h>
void rainha(int casa2){
    if(casa2 > 0){
        printf("Rainha esquerda\n");
        rainha(casa2 - 1);
    } 
}


void bispo(int casa1){
    if(casa1 > 0){
        printf("Bispo cima direita\n");
        bispo(casa1 - 1);
    } 
}

void torre(int casa){
    if(casa > 0){
        printf("Torre direita\n");
        torre(casa - 1);
    }
}

int main(){
    torre(5);
    printf("\n");
    bispo(5);
    printf("\n");
    rainha(8);

    return 0;
}
