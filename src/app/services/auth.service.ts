import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription, Subject, Observable } from 'rxjs';
import { User } from '../auth/user.interface';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private http: HttpClient, private router: Router) {
    const tokenActive = localStorage.getItem('token');
    if (tokenActive) {
      this.token = tokenActive;
      this.initInterval();
    } else {
      this.token = null;
    }
    this.userLoggedIn.next(false);
    this.userToken.next(this.token);
    const userName = localStorage.getItem('name');
    this.name = userName;
    userName ? this.userName.next(userName) : this.userName.next(null);
  }
  urlApi = 'https://cdc-todo-be.herokuapp.com/';
  private token = null;
  private expiredTime: number;
  private name: string = localStorage.getItem('name');
  subscription = Subscription;
  private userLoggedIn = new Subject<boolean>();
  private userToken = new Subject();
  private userName = new Subject();

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

  setToken(token: string, email?: string) {
    this.token = token;
    this.expiredTime = Date.now() + 60 * 60 * 1000; // add one hour
    // get name
    this.http.get(this.urlApi + 'users/').subscribe((users: any[]) => {
      const user = users.find(dt => dt.email === email);
      this.name = user.name;
      localStorage.setItem('name', this.name);
      localStorage.setItem('expiredTime', `${this.expiredTime}`);
      this.userName.next(this.name);
    });
    localStorage.setItem('token', token);
    this.userToken.next(token);
    this.userLoggedIn.next(token ? true : false);
    this.initInterval();
    this.router.navigate(['/home']);
  }

  obsUserToken() {
    return this.userToken.asObservable();
  }

  obsUserLoggedIn(): Observable<boolean> {
    return this.userLoggedIn.asObservable();
  }

  obsUserName(): Observable<any> {
    return this.userName.asObservable();
  }

  getToken() {
    return this.token;
  }

  redirectHome() {
    if (this.token !== null) {
      this.userToken.next(this.token);
      // this.userName.next(this.name);
      this.userLoggedIn.next(true);
      this.router.navigate(['/home']);
    }
  }

  logout() {
    localStorage.clear();
    this.token = null;
    this.name = null;
    this.userToken.next(null);
    this.userName.next(null);
    this.userLoggedIn.next(false);
    this.router.navigate(['/auth/login']);
  }

  getUserName() {
    return this.name;
  }

  checkValidToken() {
    // check expired token
    this.expiredTime = +localStorage.getItem('expiredTime');
    if (this.expiredTime < Date.now()) {
      this.logout();
    }
    const minute = this.expiredTime - Date.now();
  }

  initInterval() {
    setInterval(() => {
      this.checkValidToken();
    }, 5000); // 5s
  }
}
