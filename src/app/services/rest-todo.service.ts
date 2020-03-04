import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { InstanceTodo } from '../todo-list/todo.interface';

@Injectable({ providedIn: 'root' })
export class RestTodoService {
  private urlApi = 'https://cdc-todo-be.herokuapp.com/tasks/';

  constructor(private http: HttpClient) {}

  getTodo() {
    return this.http.get<InstanceTodo[]>(this.urlApi);
  }

  addTodo(todo: InstanceTodo) {
    return this.http.post(
      this.urlApi + 'tasks/',
      { description: todo.description, deadline: todo.deadline.toISOString() },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  getDetailTodo(id: string) {
    return this.http.get<InstanceTodo>(this.urlApi + +id);
  }

  patchTodo(todo: InstanceTodo) {
    return this.http.patch(this.urlApi, todo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  completedTodo(todo: InstanceTodo) {
    return this.http.post(this.urlApi + +todo.id, new FormData(), {
      headers: new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded',
      }),
    });
  }

  incompleteTodo(todo: InstanceTodo) {
    return this.http.post(this.urlApi, todo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  deleteTodo(id: string) {
    return this.http.delete(this.urlApi + +id);
  }
}
