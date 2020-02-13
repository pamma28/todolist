import { Component, OnInit, Output } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StaticServices } from './../static-data.service';
import { InstanceTodo } from './../static-data.service';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  user = [];
  todos: any;
  faTrash = faTrash;
  totalDone: number;
  totalNotDone: number;
  notification: {
    type: string;
    message: string;
  };

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

}
