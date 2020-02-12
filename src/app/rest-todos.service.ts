import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

export class RestTodos {
  constructor(private http: HttpClient) {}
  urlApi = 'https://cdc-todo-be.herokuapp.com';
  token = null;
  subscription = Subscription;

  signIn() {
    const user = 'cdc.mitrais@mailinator.com';
    const pass = 'supersecret';

    // check token
    if (this.token) {
      // observe response with current token
      this.http
        .post(
          this.urlApi + '/users',
          { username: user, password: pass },
          { observe: 'response' },
        )
        .subscribe(
          responseData => {
            if (responseData.status !== 200) {
              // reset token and resigning
              this.token = null;
              return this.signIn();
            } else {
              return true;
            }
          },
          errorResponse => {
            console.log(errorResponse, 'retrying in 1,5s');
            // try resigning in 1,5s
            setTimeout(() => {
              return this.signIn();
            }, 1500);
          },
        );
    } else {
      // get newest token
      this.http
        .post(
          this.urlApi,
          { username: user, password: pass },
          {
            headers: new HttpHeaders({
              'çontent-type': 'application/json',
            }),
          },
        )
        // .pipe(map(tokenData => {
        //     return tokenData;
        // }))
        .subscribe((tokenData: { token?: string }) => {
          if (tokenData.token) {
            this.token = tokenData.token;
            return true;
          } else {
            console.log('failed login, retrying in 1,5s.');
            // try resigning in 1,5s
            setTimeout(() => {
              return this.signIn();
            }, 1500);
          }
        });
    }
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
}
