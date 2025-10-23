#include <stdio.h>

int main(){
    
    int i = 0;
    int p = 0;

    while (i <= 10)
    {
        if(i % 2 == 0)
        {
            printf("o número é %d é par!\n", i);
        }

        i++;
    }
    
    return 0;
}