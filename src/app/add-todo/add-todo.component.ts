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
    console.log(this.newTodos.value);
    const dt = this.newTodos.value;
    this.staticServices
      .postData({
        description: dt.description,
        deadline: moment(dt.deadline).toDate(),
        done: dt.done,
      })
      .subscribe(responseData => {
        console.log(responseData);
      });
  }

  allowedDates(control: FormControl): { [s: string]: boolean } {
    if (!moment(control.value).isAfter(moment().startOf('day'))) {
      return { allowedDates: true };
    }
    return null;
  }
}
