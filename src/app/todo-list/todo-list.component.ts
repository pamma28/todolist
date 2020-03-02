import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
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
    trigger('divState', [
      state('normal', style({ transform: 'translateX(0)' })),
      state(
        'newAdded',
        style({ backgroundColor: 'darkblue', transform: 'translateX(100px)' }),
      ),
      transition('normal => newAdded', [animate(300)]),
      transition('newAdded => normal', [animate(500)]),
      // transition('zoomed <=> *', [animate(800)]),
    ]),
    trigger('newAddedAnimation', [
      state('in', style({ opacity: 1, transform: 'translateY(0)' })),
      transition('void => *', [
        style({
          opacity: 0,
          transform: 'translateY(100px)',
          backgroundColor: '#007bff',
        }),
        animate(400),
      ]),
      transition('* => void', [
        animate(
          400,
          style({
            opacity: 0,
            transform: 'translateY(100px)',
            backgroundColor: '#007bff',
          }),
        ),
      ]),
    ]),
  ],
})
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
  animateState = 'normal';
  state = 'normal';
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
        console.log('obsData', newData);
        this.newId = newData;
      },
      err => {
        console.log(err);
      },
    );
    this.newId = this.staticServices.getNewDataList();
    console.log(this.newId);

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

  onAnimate() {
    this.animateState = this.animateState === 'normal' ? 'newAdded' : 'normal';
  }

  ngOnDestroy() {
    this.observerNewData.unsubscribe();
  }
}
