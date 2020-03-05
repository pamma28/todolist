import { Component, OnInit } from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  ValidationErrors,
  AbstractControl,
} from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private restServices: AuthService,
  ) {
    this.signForm = new FormGroup({
      name: new FormControl(''),
      email: new FormControl('', [Validators.required, Validators.email], []),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
      ]),
      repassword: new FormControl(''),
    });
  }

  signForm: FormGroup;
  notification: {
    type: string;
    message: string;
  };
  signin = true;
  isLoading = false;

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
          break;
        case 'login':
          this.signin = true;
          break;
        default:
          this.router.navigate(['/404']);
          break;
      }
      // console.log(this.signin);
      this.notification = undefined;
      this.signForm.reset();

      if (this.signin) {
        this.signForm.get('name').clearValidators();
        this.signForm.get('repassword').clearValidators();
      } else {
        this.signForm
          .get('name')
          .setValidators([Validators.required, Validators.minLength(4)]);

        this.signForm
          .get('repassword')
          .setValidators([
            Validators.required,
            Validators.minLength(8),
            AuthComponent.matchValues('password'),
          ]);
      }

      // tslint:disable-next-line: forin
      for (const key in this.signForm.controls) {
        this.signForm.get(key).updateValueAndValidity();
      }
    });
  }

  onSubmit() {
    this.isLoading = true;
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
              this.restServices.setToken(
                dataToken.access_token,
                this.signForm.get('email').value,
              );
            } else {
              this.isLoading = false;
              // error handling
              this.notification = {
                type: 'failed',
                message: 'error login, please try again',
              };
            }
          },
          errSignin => {
            this.isLoading = false;
            this.notification = {
              type: 'failed',
              message: errSignin.error.message
                ? errSignin.error.message
                : errSignin.error.error,
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
            this.isLoading = false;
            if (dataSignUp) {
              // this.router.navigate(['auth/login']);
              this.notification = {
                type: 'success',
                message: 'registration success, you can sign in now',
              };
              this.signForm.reset();
            } else {
              this.notification = {
                type: 'failed',
                message: 'error registration, please try again',
              };
            }
          },
          errSignUp => {
            this.isLoading = false;
            this.notification = {
              type: 'failed',
              message: errSignUp.error.message
                ? errSignUp.error.message
                : errSignUp.error.error,
            };
          },
        );
    }
  }
}
