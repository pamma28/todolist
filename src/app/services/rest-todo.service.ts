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
      this.urlApi,
      { description: todo.description, deadline: todo.deadline.toISOString() },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  getDetailTodo(id: string) {
    return this.http.get<InstanceTodo>(this.urlApi + id);
  }

  patchTodo(todo: InstanceTodo) {
    return this.http.patch(this.urlApi + todo.id, todo, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    });
  }

  completedTodo(todo: InstanceTodo, path: string | ArrayBuffer) {
    const formData = new FormData();
    formData.append('snapshot', todo.snapshot, path as string);
    return this.http.post(this.urlApi + todo.id + '/complete', formData, {
      headers: new HttpHeaders({
        mimeType: 'multipart/form-data',
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
    return this.http.delete(this.urlApi + id);
  }
}
