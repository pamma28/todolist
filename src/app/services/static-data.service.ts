import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { InstanceTodo } from './../todo-list/todo.interface';

@Injectable({ providedIn: 'root' })
export class StaticServices {
  urlApi = 'https://cdc-web-frontend.herokuapp.com/todos';

  constructor(private http: HttpClient) {}
  private subject = new Subject();
  arrNewData = [];

  getData() {
    return this.http.get<InstanceTodo[]>(this.urlApi);
  }

  postData(data: InstanceTodo) {
    return this.http.post(this.urlApi, data);
  }

  updateData(data: InstanceTodo) {
    return this.http.put(this.urlApi + `/${data.id}`, data);
  }

  deleteData(id: string) {
    return this.http.delete(this.urlApi + `/${id}`);
  }

  addNewDataList(id: string) {
    this.arrNewData.push(id);
    this.subject.next(this.arrNewData);
  }

  observableNewData() {
    return this.subject.asObservable();
  }

  resetNewDataList() {
    this.subject.next([]);
  }
}
