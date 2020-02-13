import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticServices } from '../static-data.service';
import * as moment from 'moment';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
export class AddTodoComponent implements OnInit {
  constructor(private staticServices: StaticServices) {}
  newTodos: FormGroup;
  notification: {
    type: string;
    message: string;
  };

  ngOnInit() {
    this.newTodos = new FormGroup({
      description: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
      ]),
      deadline: new FormControl('', [Validators.required, this.allowedDates]),
      done: new FormControl(false, []),
    });
  }

  onSubmit() {
    const dt = this.newTodos.value;
    this.staticServices
      .postData({
        description: dt.description,
        deadline: moment(dt.deadline).toDate(),
        done: dt.done,
      })
      .subscribe(
        responseData => {
          this.notification = {
            type: 'success',
            message: 'Todos been saved',
          };
          this.newTodos.reset();
        },
        errorMessage => {
          this.notification = {
            type: 'failed',
            message: errorMessage.message,
          };
        },
      );
  }

  allowedDates(control: FormControl): { [s: string]: boolean } {
    if (
      !moment(control.value).isAfter(moment().startOf('day')) ||
      !moment(control.value, 'YYYY-MM-DD', true).isValid()
    ) {
      return { allowedDates: true };
    }
    return null;
  }
}
