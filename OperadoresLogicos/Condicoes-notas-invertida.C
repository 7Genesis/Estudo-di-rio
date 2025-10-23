#include <stdio.h>

int main(){
    int nota;
    
    printf("Digite sua nota: ");
    scanf("%d", &nota);

    if(nota >= 90){
        printf("Sua nota é A!\n");
    }else if(nota >= 80 && nota < 90){
        printf("Sua nota é B!\n");
    }else if(nota >= 70 && nota < 80){
        printf("Sua nota é C!\n");
    }else if(nota >= 60 && nota < 70){
        printf("Sua nota é D!\n");
    }else{
        printf("Sua nota é F!\n");
    }
}