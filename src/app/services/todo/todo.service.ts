import { Injectable } from '@angular/core';
import { Todo } from '../../models/Todo';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../environment';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  apiUrl: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + '/todos';
  }

  getTodos(): Observable<Todo[]> {
    // const headers = new HttpHeaders({
    //   'Content-Type': 'application/json',
    // });
    return this.http.get<Todo[]>(this.apiUrl, {
      // headers: headers,
      withCredentials: true,
    });
  }

  // editTodo(todo: Todo, timezone: string): Observable<Todo> {
  //   if (todo.repeat !== 'none' && todo.completed === true) {
  //     todo.completed = false;

  //     switch (todo.repeat) {
  //       case 'daily':
  //         todo.date = new Date(
  //           new Date(todo.date).setDate(new Date(todo.date).getDate() + 1)
  //         )
  //           .toISOString()
  //           .split('T')[0];
  //         break;
  //       case 'weekly':
  //         todo.date = new Date(
  //           new Date(todo.date).setDate(new Date(todo.date).getDate() + 7)
  //         )
  //           .toISOString()
  //           .split('T')[0];
  //         break;
  //       case 'monthly':
  //         todo.date = new Date(
  //           new Date(todo.date).setMonth(new Date(todo.date).getMonth() + 1)
  //         )
  //           .toISOString()
  //           .split('T')[0];
  //         break;
  //       case 'yearly':
  //         todo.date = new Date(
  //           new Date(todo.date).setFullYear(
  //             new Date(todo.date).getFullYear() + 1
  //           )
  //         )
  //           .toISOString()
  //           .split('T')[0];
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //   return this.http.put<Todo>(this.apiUrl, todo, { withCredentials: true });
  // }

  editTodo(todo: Todo, timezone: string): Observable<Todo> {
    if (todo.repeat !== 'none' && todo.completed) {
      todo.completed = false;

      const currentDate = new Date(todo.date);

      switch (todo.repeat) {
        case 'daily':
          currentDate.setDate(currentDate.getDate() + 1);
          break;
        case 'weekly':
          currentDate.setDate(currentDate.getDate() + 7);
          break;
        case 'monthly':
          currentDate.setMonth(currentDate.getMonth() + 1);
          break;
        case 'yearly':
          currentDate.setFullYear(currentDate.getFullYear() + 1);
          break;
        default:
          break;
      }

      todo.date = this.formatDateInTimezone(currentDate, timezone);
    }

    return this.http.put<Todo>(this.apiUrl, todo, { withCredentials: true });
  }

  /**
   * Formats a Date object to 'YYYY-MM-DD' in the given timezone.
   * If timezone is empty, fallback to UTC.
   */
  private formatDateInTimezone(date: Date, timezone: string): string {
    const tz = timezone || 'UTC';

    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: tz,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    const parts = formatter.formatToParts(date);
    const year = parts.find((p) => p.type === 'year')?.value;
    const month = parts.find((p) => p.type === 'month')?.value;
    const day = parts.find((p) => p.type === 'day')?.value;

    return `${year}-${month}-${day}`;
  }

  editTodoDate(todo: Todo): Observable<Todo> {
    todo.repeat = 'none';
    todo.completed = false;
    return this.http.put<Todo>(this.apiUrl, todo, {
      withCredentials: true,
    });
  }

  deleteTodo(todo: Todo): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });
    return this.http.delete<string>(this.apiUrl + `/${todo.id}`, {
      headers: headers,
      body: todo,
      withCredentials: true,
    });
  }

  addTask(title: string): Observable<Todo> {
    let currentDate = new Date();
    //date in the format of yyyy-mm-dd

    let formattedDate = currentDate.toISOString().split('T')[0];

    const todo: Todo = {
      title: title,
      completed: false,
      date: formattedDate,
      uid: localStorage.getItem('uid') || '',
      repeat: 'none',
      remind: 'true',
    };
    return this.http.post<Todo>(this.apiUrl, todo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
      withCredentials: true,
    });
  }
}
