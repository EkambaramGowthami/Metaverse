#include <stdio.h>
#include <stdlib.h>
#include <pthread.h>
#include <unistd.h>
#define BUFFER_SIZE 5  
int buffer[BUFFER_SIZE];
int count = 0;          
int in = 0, out = 0;    
pthread_mutex_t mutex;
pthread_cond_t notFull;
pthread_cond_t notEmpty;
void* producer(void* arg) {
    (void)arg;  
    for (int i = 0; i < 10; i++) {   
        int item = rand() % 100;     

        pthread_mutex_lock(&mutex);
        while (count == BUFFER_SIZE) {
            pthread_cond_wait(&notFull, &mutex);
        }
        buffer[in] = item;
        in = (in + 1) % BUFFER_SIZE;
        count++;
        printf("Producer produced: %d\n", item);
        pthread_cond_signal(&notEmpty);
        pthread_mutex_unlock(&mutex);
        sleep(1); 
    }
    return NULL;
}

void* consumer(void* arg) {
    (void)arg; 
    for (int i = 0; i < 10; i++) {  
        pthread_mutex_lock(&mutex);
        while (count == 0) {
            pthread_cond_wait(&notEmpty, &mutex);
        }

        int item = buffer[out];
        out = (out + 1) % BUFFER_SIZE;
        count--;

        printf("Consumer consumed: %d\n", item);
        pthread_cond_signal(&notFull);
        pthread_mutex_unlock(&mutex);
        sleep(2); 
    }
    return NULL;
}

int main() {
    pthread_t prodThread, consThread;
    pthread_mutex_init(&mutex, NULL);
    pthread_cond_init(&notFull, NULL);
    pthread_cond_init(&notEmpty, NULL);
    pthread_create(&prodThread, NULL, producer, NULL);
    pthread_create(&consThread, NULL, consumer, NULL);
    pthread_join(prodThread, NULL);
    pthread_join(consThread, NULL);
    pthread_mutex_destroy(&mutex);
    pthread_cond_destroy(&notFull);
    pthread_cond_destroy(&notEmpty);

    return 0;
}
