import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { StaticServices } from './../services/static-data.service';
import { InstanceTodo } from './../todo-list/todo.interface';
import * as moment from 'moment';
import { CanComponentDeactivate } from './can-deactivate-guard.interface';
import { Observable, Observer } from 'rxjs';
import { RestTodoService } from '../services/rest-todo.service';
import { MimeValidators } from './mime-type.validator';

@Component({
  selector: 'app-add-todo',
  templateUrl: './add-todo.component.html',
  styleUrls: ['./add-todo.component.css'],
})
/*
AddTodoComponent can be used for edit and add new 'todo' depends on state parameter given.
if given, then act like edit, if not it will add new.
it has custom validators 'allowedDates' for date input.
it has guard 'canDeactivate' to prevent user from leaving page before saving data
it uses observable from 'StaticServices' to collect new data list, then display animation on home.
 */
export class AddTodoComponent implements OnInit, CanComponentDeactivate {
  constructor(
    private staticServices: StaticServices,
    private restServices: RestTodoService,
  ) {}

  newTodos: FormGroup;
  notification: {
    type: string;
    message: string;
  };
  dataSaved = false;
  editForm = false;
  previewScreenshot: string | ArrayBuffer;
  minDate = moment()
    .add(1, 'day')
    .startOf('day')
    .toDate();

  ngOnInit() {
    // edit logic
    if (history.state.todo) {
      this.editForm = true;
      const editData: InstanceTodo = history.state.todo;
      this.previewScreenshot = editData.snapshot ? editData.snapshot : null;

      this.newTodos = new FormGroup({
        description: new FormControl(editData.description, [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ]),
        deadline: new FormControl(
          moment(editData.deadline)
            .endOf('day')
            .format('YYYY-MM-DD'),
          [Validators.required, this.allowedDates],
        ),
        snapshot: new FormControl(
          null,
          [this.imgSizeValidator],
          [MimeValidators],
        ),
        done: new FormControl(editData.done, []),
        id: new FormControl(editData.id),
      });
    } else {
      // default add
      this.newTodos = new FormGroup({
        description: new FormControl('', [
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(30),
        ]),
        deadline: new FormControl('', [Validators.required, this.allowedDates]),
        snapshot: new FormControl(null, [], []),
        done: new FormControl('', []),
        id: new FormControl(''),
      });
    }
  }

  onSubmit() {
    const dt = this.newTodos.value;
    if (dt.id) {
      // check done and image attachment
      if (
        this.newTodos.get('done').value === true &&
        this.newTodos.get('snapshot').value !== null
      ) {
        // upload the image
        this.restServices
          .completedTodo(this.newTodos.value, this.previewScreenshot)
          .subscribe(
            (resData: InstanceTodo) => {},
            errUpload => {
              console.log(errUpload);
            },
          );
      }

      // logic edit
      this.restServices
        .patchTodo({
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
            this.editForm = true;
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
      this.restServices
        .addTodo({
          description: dt.description,
          deadline: moment(dt.deadline).toDate(),
        })
        .subscribe(
          (responseData: InstanceTodo) => {
            this.notification = {
              type: 'success',
              message: 'Todos has been saved',
            };
            this.newTodos.reset();
            this.dataSaved = true;
            // newId broadcast to observable
            this.onSuccessAddition(responseData.id);
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

  canDeactivate(): Observable<boolean> | Promise<boolean> | boolean {
    if (this.newTodos.value.description || this.newTodos.value.date) {
      if (!this.dataSaved) {
        return confirm('Do you really want to leave form?');
      }
    }
    return true;
  }

  onImageSelected(event: Event) {
    const image = (event.target as HTMLInputElement).files[0];
    this.newTodos.patchValue({ snapshot: image });
    this.newTodos.get('snapshot').updateValueAndValidity();

    const img = new FileReader();
    img.onload = () => {
      this.previewScreenshot = img.result;
    };
    img.readAsDataURL(image);
    // this.uploadFilePath = img.readAsDataURL(image);
  }

  onSuccessAddition(id?: string) {
    this.staticServices.addNewDataList(id);
  }

  imgSizeValidator(control: FormControl): { [key: string]: any } {
    if (!control.value) {
      return null;
    }

    const file = control.value as File;
    // 200kb max size
    if (file.size > 200 * 2 ** 10) {
      return { maxFileSize: true };
    }
    return null;
  }
}
