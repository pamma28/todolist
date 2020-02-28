import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Params, ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor(private route: ActivatedRoute, private router: Router) {}
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
      email: new FormControl('', [Validators.required], []),
      password: new FormControl(
        '',
        [Validators.required, Validators.minLength(6)],
        [],
      ),
      repassword: new FormControl('', [], []),
    });
  }

  onSubmit() {
    console.log(this.signForm);
  }
}
