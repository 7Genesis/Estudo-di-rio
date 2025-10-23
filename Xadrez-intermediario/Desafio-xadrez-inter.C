#include <stdio.h>

int main(){
    int torre = 0;
    int bispo = 0;
    int rainha = 0;
    


    while(torre < 5)
    {
        printf("Torre Direita\n", torre);
        torre++;
    }while(bispo < 5){
        printf("Bispo Cima Direita\n", bispo);
        bispo++;
    }while(rainha < 8){
        printf("Rainha Esquerda\n", rainha);
        rainha++;
    }
    for(int i = 0; i < 3; i++){
        if(i < 2){
        printf("Cavalo Cima\n");
        }else{
        printf("Cavalo Esquerda\n");
    }
}

    return 0;

}
