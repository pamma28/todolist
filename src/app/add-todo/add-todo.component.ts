import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticServices } from '../static-data.service';
import { InstanceTodo } from './../static-data.service';
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
    // edit logic
    if (history.state.todo) {
      const editData: InstanceTodo = history.state.todo;
      this.newTodos = new FormGroup({
        description: new FormControl(editData.description, [
          Validators.required,
          Validators.maxLength(100),
        ]),
        deadline: new FormControl(
          moment(editData.deadline)
            .endOf('day')
            .format('YYYY-MM-DD'),
          [Validators.required, this.allowedDates],
        ),
        done: new FormControl(editData.done, []),
        id: new FormControl(editData.id),
      });
    } else {
      // default add
      this.newTodos = new FormGroup({
        description: new FormControl('', [
          Validators.required,
          Validators.maxLength(100),
        ]),
        deadline: new FormControl('', [Validators.required, this.allowedDates]),
        done: new FormControl(false, []),
        id: new FormControl(''),
      });
    }
  }

  onSubmit() {
    const dt = this.newTodos.value;
    if (dt.id) {
      // logic edit
      this.staticServices
        .updateData({
          description: dt.description,
          deadline: moment(dt.deadline).toDate(),
          done: dt.done,
          id: dt.id,
        })
        .subscribe(
          responseData => {
            this.notification = {
              type: 'success',
              message: 'Todos has been updated',
            };
          },
          errorMessage => {
            this.notification = {
              type: 'failed',
              message: errorMessage.message,
            };
          },
        );
    } else {
      // logic add
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
              message: 'Todos has been saved',
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
