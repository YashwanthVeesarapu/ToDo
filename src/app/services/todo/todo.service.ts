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
  private jwtToken: string;
  private uid: string;

  constructor(private http: HttpClient) {
    this.apiUrl = environment.apiUrl + 'todos';
    this.jwtToken = localStorage.getItem('access_token') || '';
    this.uid = localStorage.getItem('uid') || '';
  }

  getTodos(): Observable<Todo[]> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.jwtToken}`,
    });
    return this.http.get<Todo[]>(this.apiUrl + `?uid=${this.uid}`, {
      headers: headers,
    });
  }

  editTodo(todo: Todo): Observable<Todo> {
    console.log(todo);
    if (todo.repeat !== 'none' && todo.completed === true) {
      todo.completed = false;
      switch (todo.repeat) {
        case 'daily':
          todo.date = new Date(
            new Date(todo.date).setDate(new Date(todo.date).getDate() + 1)
          ).toISOString();
          break;
        case 'weekly':
          todo.date = new Date(
            new Date(todo.date).setDate(new Date(todo.date).getDate() + 7)
          ).toISOString();
          break;
        case 'monthly':
          todo.date = new Date(
            new Date(todo.date).setMonth(new Date(todo.date).getMonth() + 1)
          ).toISOString();
          break;
        case 'yearly':
          todo.date = new Date(
            new Date(todo.date).setFullYear(
              new Date(todo.date).getFullYear() + 1
            )
          ).toISOString();
          break;
        default:
          break;
      }
    }
    console.log(todo);
    return this.http.put<Todo>(this.apiUrl, todo);
  }

  editTodoDate(todo: Todo): Observable<Todo> {
    todo.repeat = 'none';
    todo.completed = false;
    return this.http.put<Todo>(this.apiUrl, todo);
  }

  deleteTodo(todo: Todo): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `${this.jwtToken}`,
    });
    return this.http.delete<string>(this.apiUrl + `/${todo.id}`, {
      headers: headers,
      body: todo,
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
      username: localStorage.getItem('username') || '',
      uid: localStorage.getItem('uid') || '',
      repeat: 'none',
      remind: 'false',
    };
    return this.http.post<Todo>(this.apiUrl, todo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: `${this.jwtToken}`,
      }),
    });
  }
}
