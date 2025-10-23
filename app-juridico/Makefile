CC=gcc
CFLAGS=-Wall -Wextra

all: programa

programa: main.c employee.c
    $(CC) $(CFLAGS) main.c employee.c -o programa

clean:
    rm -f programa