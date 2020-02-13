import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StaticServices } from './../static-data.service';
import { InstanceTodo } from './../static-data.service';
import {
  faTrash,
  faSortAmountDown,
  faSortAmountUp,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  user = [];
  todos: InstanceTodo[];
  faTrash = faTrash;
  faSortAmountDown = faSortAmountDown;
  faSortAmountUp = faSortAmountUp;
  faEdit = faEdit;
  totalDone: number;
  totalNotDone: number;
  notification: {
    type: string;
    message: string;
  };
  sortDeadline = false;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private staticServices: StaticServices,
  ) {}

  ngOnInit() {
    this.staticServices
      .getData()
      .pipe(
        map(data => {
          let finish = 0;
          let unfinish = 0;
          for (const dt of data) {
            dt.done ? finish++ : unfinish++;
          }
          this.totalDone = finish;
          this.totalNotDone = unfinish;
          if (!this.sortDeadline) {
            data.sort((a, b) =>
              moment(a.deadline).isSameOrAfter(moment(b.deadline))
                ? 1
                : moment(b.deadline).isSameOrAfter(moment(a.deadline))
                ? -1
                : 0,
            );
          } else {
            data.sort((a, b) =>
              moment(a.deadline).isSameOrBefore(moment(b.deadline))
                ? 1
                : moment(b.deadline).isSameOrBefore(moment(a.deadline))
                ? -1
                : 0,
            );
          }
          return data;
        }),
      )
      .subscribe(responseData => {
        this.todos = responseData;
      });
  }

  onAddTodo() {
    this.router.navigate(['add']);
  }

  onConfirmDelete(todo: InstanceTodo) {
    if (confirm(`Do you really want to delete "${todo.description}"?`)) {
      this.staticServices.deleteData(todo.id).subscribe(
        data => {
          this.notification = {
            type: 'success',
            message: 'Todos selected has gone',
          };
          this.ngOnInit();
        },
        errorMessage => {
          this.notification = {
            type: 'failed',
            message: errorMessage.message,
          };
        },
      );
    } else {
      this.ngOnInit();
    }
  }

  onChangeSortData() {
    this.ngOnInit();
    this.sortDeadline = !this.sortDeadline;
  }

  onEditData(todo: InstanceTodo) {
    history.pushState({ data: todo }, '', '');
    this.router.navigate([`/edit`], { state: { todo } });
  }

  onSwitchDone(todo: InstanceTodo) {
    todo.done = !todo.done;
    this.staticServices.updateData(todo).subscribe(data => {
      this.ngOnInit();
    });
  }
}
