import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, Subject, Observable } from 'rxjs';
import { User } from '../auth/user.interface';
import { Injectable } from '@angular/core';
@Injectable({ providedIn: 'root' })
export class RestTodosService {
  constructor(private http: HttpClient) {
    this.userLoggedIn.next(false);
    this.userToken.next(this.token);
  }
  urlApi = 'https://cdc-todo-be.herokuapp.com/';
  private token = null;
  subscription = Subscription;
  private userLoggedIn = new Subject<boolean>();
  private userToken = new Subject();

  signIn(user: User) {
    return this.http.post(
      this.urlApi + 'auth/signin',
      { username: user.email, password: user.password },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  signUp(user: User) {
    return this.http.post(
      this.urlApi + 'auth/signup',
      { name: user.name, email: user.email, password: user.password },
      {
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      },
    );
  }

  userTasks() {
    return this.http.get(this.urlApi + '/tasks');
  }

  completeTask(taskId: string, complete: boolean) {
    return this.http.post(
      this.urlApi + '/tasks/' + taskId + complete ? 'complete' : 'uncomplete',
      {
        headers: new HttpHeaders({
          'çontent-type': 'application/json',
        }),
      },
    );
  }

  obsUserToken() {
    return this.userToken.asObservable();
  }

  setToken(token: string) {
    this.userToken.next(token);
    this.userLoggedIn.next(token ? true : false);
  }

  obsUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  getToken() {
    return this.token;
  }
}
