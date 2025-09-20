#include <stdio.h>
#include <stdbool.h>

#define MAX_P 20   // max processes
#define MAX_R 10   // max resource types

int P, R;                         // number of processes, resources
int Allocation[MAX_P][MAX_R];
int MaxReq[MAX_P][MAX_R];
int Need[MAX_P][MAX_R];
int Available[MAX_R];

bool isSafe(int work[], int finish[], int safeSeq[]) {
    for (int i = 0; i < R; i++) work[i] = Available[i];
    for (int i = 0; i < P; i++) finish[i] = 0;

    int count = 0;
    while (count < P) {
        bool found = false;
        for (int i = 0; i < P; i++) {
            if (!finish[i]) {
                bool canRun = true;
                for (int j = 0; j < R; j++) {
                    if (Need[i][j] > work[j]) { canRun = false; break; }
                }
                if (canRun) {
                    for (int j = 0; j < R; j++) work[j] += Allocation[i][j];
                    safeSeq[count++] = i;
                    finish[i] = 1;
                    found = true;
                }
            }
        }
        if (!found) break; // deadlock potential, not safe
    }
    return (count == P);
}

void computeNeed() {
    for (int i = 0; i < P; i++)
        for (int j = 0; j < R; j++)
            Need[i][j] = MaxReq[i][j] - Allocation[i][j];
}

void printState() {
    printf("\nProcess\tAllocation\tMax\t\tNeed\n");
    for (int i = 0; i < P; i++) {
        printf("P%-3d\t", i);
        for (int j = 0; j < R; j++) printf("%d ", Allocation[i][j]);
        printf("\t\t");
        for (int j = 0; j < R; j++) printf("%d ", MaxReq[i][j]);
        printf("\t\t");
        for (int j = 0; j < R; j++) printf("%d ", Need[i][j]);
        printf("\n");
    }
    printf("Available: ");
    for (int j = 0; j < R; j++) printf("%d ", Available[j]);
    printf("\n");
}

int main() {
    printf("=== Banker's Algorithm (Safety + Request) ===\n");

    
    printf("Enter number of processes (<= %d): ", MAX_P);
    scanf("%d", &P);
    printf("Enter number of resource types (<= %d): ", MAX_R);
    scanf("%d", &R);

    // Input Allocation
    printf("\nEnter Allocation matrix (%d x %d):\n", P, R);
    for (int i = 0; i < P; i++)
        for (int j = 0; j < R; j++)
            scanf("%d", &Allocation[i][j]);

    printf("\nEnter Max matrix (%d x %d):\n", P, R);
    for (int i = 0; i < P; i++)
        for (int j = 0; j < R; j++)
            scanf("%d", &MaxReq[i][j]);

    printf("\nEnter Available vector (%d values):\n", R);
    for (int j = 0; j < R; j++) scanf("%d", &Available[j]);
    computeNeed();
    printState();
    int work[MAX_R], finish[MAX_P], safeSeq[MAX_P];
    if (isSafe(work, finish, safeSeq)) {
        printf("\nSystem is in a SAFE state.\nSafe sequence: ");
        for (int i = 0; i < P; i++) {
            printf("P%d", safeSeq[i]);
            if (i != P - 1) printf(" -> ");
        }
        printf("\n");
    } else {
        printf("\nSystem is NOT in a safe state.\n");
    }
    char choice;
    printf("\nDo you want to test a resource request? (y/n): ");
    scanf(" %c", &choice);
    if (choice == 'y' || choice == 'Y') {
        int pid;
        int Request[MAX_R];
        printf("Enter process id (0..%d): ", P - 1);
        scanf("%d", &pid);
        printf("Enter Request vector for P%d (%d values): ", pid, R);
        for (int j = 0; j < R; j++) scanf("%d", &Request[j]);
        bool valid = true;
        for (int j = 0; j < R; j++) {
            if (Request[j] > Need[pid][j]) { valid = false; break; }
            if (Request[j] > Available[j]) { valid = false; break; }
        }

        if (!valid) {
            printf("Request cannot be granted immediately (exceeds Need or Available).\n");
        } else {
            for (int j = 0; j < R; j++) {
                Available[j]        -= Request[j];
                Allocation[pid][j]  += Request[j];
                Need[pid][j]        -= Request[j];
            }
            if (isSafe(work, finish, safeSeq)) {
                printf("Request CAN be granted. System remains SAFE.\nSafe sequence: ");
                for (int i = 0; i < P; i++) {
                    printf("P%d", safeSeq[i]);
                    if (i != P - 1) printf(" -> ");
                }
                printf("\n");
            } else {
                for (int j = 0; j < R; j++) {
                    Available[j]        += Request[j];
                    Allocation[pid][j]  -= Request[j];
                    Need[pid][j]        += Request[j];
                }
                printf("Request CANNOT be granted (would lead to UNSAFE state). Rolled back.\n");
            }
        }
    }

    return 0;
}
