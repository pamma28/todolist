import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subscription, Observable } from 'rxjs';
export interface InstanceTodo {
  id?: string;
  description?: string;
  deadline?: Date;
  done?: boolean;
}

@Injectable({ providedIn: 'root' })
export class StaticServices {
  urlApi = 'https://cdc-web-frontend.herokuapp.com/todos';

  constructor(private http: HttpClient) {}

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
}
