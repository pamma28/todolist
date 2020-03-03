import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
  keyframes,
} from '@angular/animations';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

import { StaticServices } from './../services/static-data.service';
import { InstanceTodo } from './../todo-list/todo.interface';
import {
  faTrash,
  faSortAmountDown,
  faSortAmountUp,
  faEdit,
} from '@fortawesome/free-solid-svg-icons';
import * as moment from 'moment';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
  animations: [
    trigger('newDeletedAnimation', [
      state(
        'deleted',
        style({
          opacity: 1,
          transform: 'translateY(0px)',
        }),
      ),
      transition('* => void', [
        animate(
          500,
          keyframes([
            style({
              opacity: 0.8,
              transform: 'translateY(-10px)',
              backgroundColor: 'red',
              offset: 0.1,
            }),
            style({
              opacity: 0.2,
              transform: 'translateY(-80px)',
              backgroundColor: 'red',
              offset: 0.8,
            }),
            style({
              opacity: 0,
              transform: 'translateY(-100px)',
              backgroundColor: 'red',
              offset: 1,
            }),
          ]),
        ),
      ]),
    ]),

    trigger('newAddedAnimation', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(100px)',
          backgroundColor: '#007bff',
        }),
        animate(
          500,
          keyframes([
            style({
              opacity: 0,
              transform: 'translateY(0px)',
              backgroundColor: '#007bff',
              offset: 0.1,
            }),
            style({
              opacity: 0.8,
              transform: 'translateY(80px)',
              backgroundColor: '#007bff',
              offset: 0.8,
            }),
            style({
              opacity: 1,
              transform: 'translateY(100px)',
              backgroundColor: '#007bff',
              offset: 1,
            }),
          ]),
        ),
      ]),
    ]),
  ],
})

/*
TodoListComponent display list of 'todo' from 'StaticServices'.
animate new data with 'newAddedAnimation' from observable 'StaticServices'.
animate deleted data with 'newDeletedAnimation'.
it has custom directive, 'appHover' to show todo has done with springgreen background.
 */
export class TodoListComponent implements OnInit, OnDestroy {
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
  newTodo = true;
  newId: any[] = [];
  observerNewData: Subscription;

  constructor(
    private staticServices: StaticServices,
    private router: Router,
    private activeRoute: ActivatedRoute,
  ) {}

  ngOnInit() {
    this.observerNewData = this.staticServices.observableNewData().subscribe(
      (newData: any[]) => {
        this.newId = newData;
      },
      err => {
        console.log(err);
      },
    );
    this.newId = this.staticServices.getNewDataList();

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
          this.todos = this.todos.filter(
            dt => dt.id.toString() !== todo.id.toString(),
          );
        },
        errorMessage => {
          this.notification = {
            type: 'failed',
            message: errorMessage.message,
          };
        },
      );
    } else {
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
      this.todos[this.todos.indexOf(todo)].done = todo.done;
    });
  }

  // onAnimate() {
  //   console.log(this.animateState);
  //   this.animateState = this.animateState === 'normal' ? 'newAdded' : 'normal';
  // }

  ngOnDestroy() {
    this.observerNewData.unsubscribe();
  }

  resetDataAnimation(event: Event) {
    this.staticServices.resetNewDataList();
  }
}
