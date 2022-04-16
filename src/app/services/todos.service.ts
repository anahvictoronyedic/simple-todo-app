import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError, of } from 'rxjs';
import { TODO, TODO_STATUS } from '../types/todo';
import { map, switchMap } from 'rxjs/operators';
import { config } from '../data/config';

@Injectable({
  providedIn: 'root',
})
export class TodosService {

  private TODOS_URL = 'https://jsonplaceholder.typicode.com/todos';

  constructor(private http: HttpClient) {}

  getTodos(): Observable<TODO[]> {

    return this.http.get<any[]>(this.TODOS_URL).pipe(
      switchMap((todos) => {
        const epochMillis = Date.now();

        // extract the last digit
        const lastDigit = epochMillis % 10;

        // check if not prime
        if (!this.isPrime(lastDigit)) {
          return of(todos);
        }

        const errMsg = `TodosService.getTodos() : the last digit of current epoch time in milliseconds should not be prime : ${epochMillis}`;

        console.log(errMsg);

        // return failure to user
        return throwError(errMsg);
      }),
      map((todos) =>
        todos.slice(0, config.todos.fetch.count).map(this.hydrateTodo)
      )
    );
  }

  /**
   * @param n the number to check
   * @returns is boolean that indicates if the number is prime
   */
  private isPrime(n: number) :boolean{
    if( n < 2 ) return false;
    for (let i = 2; i < n; i++) {
      if (n % i == 0) return false;
    }
    return true;
  }

  /**
   * will be used to carry out todo data normalization which means converting the data returned from the API to a data structure format 
   * used through out the application.
   * 
   * @param todo the unnormalized todo object
   * @returns the normalized todo object
   */
  private hydrateTodo(todo: any): TODO {
    return {
      title: todo.title,
      status: todo.completed ? TODO_STATUS.COMPLETED : TODO_STATUS.IN_PROGRESS,
    };
  }
}
