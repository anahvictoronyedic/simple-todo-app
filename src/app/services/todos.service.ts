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

        const lastDigit = epochMillis % 10;

        console.log(
          `TodosService.getTodos() timeNow , lastDigit : ${epochMillis} , ${lastDigit}`
        );

        if (!this.isPrime(lastDigit)) {
          return of(todos);
        }

        const errMsg = `TodosService.getTodos() time should not be prime : ${epochMillis}`;

        console.log(errMsg);

        return throwError(errMsg);
      }),
      map((todos) =>
        todos.slice(0, config.todos.fetch.count).map(this.hydrateTodo)
      )
    );
  }

  private isPrime(n: number) {
    if( n < 2 ) return false;
    for (let i = 2; i < n; i++) {
      if (n % i == 0) return false;
    }
    return true;
  }

  private hydrateTodo(todo: any): TODO {
    return {
      title: todo.title,
      status: todo.completed ? TODO_STATUS.COMPLETED : TODO_STATUS.IN_PROGRESS,
    };
  }
}
