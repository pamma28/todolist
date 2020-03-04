import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, Subject, Observable } from 'rxjs';
import { User } from '../auth/user.interface';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    const tokenActive = localStorage.getItem('token');
    this.token = tokenActive ? tokenActive : null;
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
    this.token = token;
    localStorage.setItem('token', token);
    this.userToken.next(token);
    this.userLoggedIn.next(token ? true : false);
    this.router.navigate(['/home']);
  }

  obsUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  getToken() {
    return this.token;
  }

  redirectHome() {
    if (this.token !== null) {
      this.userToken.next(this.token);
      this.userLoggedIn.next(true);
      this.router.navigate(['/home']);
    }
  }

  logout() {
    localStorage.clear();
    this.token = null;
    this.userToken.next(null);
    this.userLoggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }
}
