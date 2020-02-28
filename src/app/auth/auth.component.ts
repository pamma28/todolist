import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css'],
})
export class AuthComponent implements OnInit {
  constructor() {}
  signForm: FormGroup;
  notification: string;

  ngOnInit(): void {
    this.signForm = new FormGroup({
      email: new FormControl('', [Validators.required], []),
      password: new FormControl(
        '',
        [Validators.required, Validators.minLength(6)],
        [],
      ),
    });
  }

  onSubmit() {
    console.log(this.signForm);
  }
}
