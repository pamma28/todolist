import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
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
  ) {
    this.signForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email], []),
      password: new FormControl(''),
      repassword: new FormControl(''),
    });
  }

  signForm: FormGroup;
  notification: {
    type: string;
    message: string;
  };
  signin = true;

  public static matchValues(
    matchTo: string,
  ): (AbstractControl) => ValidationErrors | null {
    return (control: AbstractControl): ValidationErrors | null => {
      return !!control.parent &&
        !!control.parent.value &&
        control.value === control.parent.controls[matchTo].value
        ? null
        : { isMatching: false };
    };
  }

  ngOnInit(): void {
    this.restServices.redirectHome();

    this.route.params.subscribe((params: Params) => {
      switch (params.page) {
        case 'signup':
          this.signin = false;
          this.signForm.reset();
          break;
        case 'login':
          this.signin = true;
          this.signForm.reset();
          break;
        default:
          this.router.navigate(['/404']);
          break;
      }
      // console.log(this.signin);
      this.notification = undefined;

      this.signForm
        .get('name')
        .setValidators(
          this.signin ? [] : [Validators.required, Validators.minLength(4)],
        );

      this.signForm.get('password').setValidators(
        this.signin
          ? [Validators.required, Validators.minLength(8)]
          : [
              Validators.required,
              Validators.minLength(8),
              // AuthComponent.matchValues('repassword'),
            ],
      );

      this.signForm
        .get('repassword')
        .setValidators(
          this.signin
            ? []
            : [
                Validators.required,
                Validators.minLength(8),
                AuthComponent.matchValues('password'),
              ],
        );
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
            } else {
              // error handling
              this.notification = {
                type: 'failed',
                message: 'error login, please try again',
              };
            }
          },
          errSignin => {
            this.notification = {
              type: 'failed',
              message: errSignin.error.message,
            };
          },
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
            this.notification = {
              type: 'failed',
              message: 'error login, please try again',
            };
          },
          errSignUp => {
            this.notification = {
              type: 'failed',
              message: errSignUp.error.message,
            };
          },
        );
    }
  }
}
