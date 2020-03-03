import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { RestTodosService } from '../services/rest-todos.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restServices: RestTodosService,
  ) {}
  signForm: FormGroup;
  notification: string;
  signin = true;

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      switch (params.page) {
        case 'signup':
          this.signin = false;
          break;
        case 'login':
          this.signin = true;
          break;
        default:
          this.router.navigate(['/404']);
          break;
      }
    });

    this.signForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', [Validators.required], []),
      password: new FormControl(
        '',
        [Validators.required, Validators.minLength(8)],
        [],
      ),
      repassword: new FormControl(
        '',
        this.signin
          ? []
          : [
              Validators.required,
              Validators.minLength(8),
              // Validators.pattern(
              //   '^(?=.*[A-Za-z])(?=.*d)(?=.*[@$!%*#?&])[A-Za-zd@$!%*#?&]$',
              // ),
            ],
        [],
      ),
    });
  }

  onSubmit() {
    if (this.signin) {
      // logic if login
      const validSignin = false;
      this.restServices
        .signIn({
          email: this.signForm.get('email').value,
          password: this.signForm.get('password').value,
        })
        .subscribe(
          (dataToken: { access_token: string }) => {
            if (dataToken) {
              this.restServices.setToken(dataToken.access_token);
              this.router.navigate(['/']);
            } else {
              // error handling
            }
          },
          errSignin => {},
        );
    } else {
      // logic if sign up
      const validSignUp = this.restServices
        .signUp({
          name: this.signForm.get('name').value,
          email: this.signForm.get('email').value,
          password: this.signForm.get('password').value,
        })
        .subscribe(
          dataSignUp => {
            if (dataSignUp) {
              this.router.navigate(['auth/login']);
            }
          },
          errSignUp => {},
        );
    }
  }
}
