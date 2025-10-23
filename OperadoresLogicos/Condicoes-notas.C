#include <stdio.h>

int main(){
    int nota;


    printf("Digite a sua nota: ");
    scanf("%d",&nota);
    //A >= 90
    //B >= 80
    //C >= 70
    //D >= 60
    //F

    if(nota >= 90){
        printf("Você tirou A!\n");
    }else if(nota >= 80 && nota < 90){
        printf("Você tirou B!\n");
    }else if(nota >= 70 && nota < 80){
        printf("Você tirou C!\n");
    }else if(nota >= 60 && nota < 70){
        printf("Você tirou D!\n");
    }else{
        printf("Você tirou F!\n");
    }
}