import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { StaticServices } from './../static-data.service';
import { InstanceTodo } from './../static-data.service';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  user = [];
  todos: any;

  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private staticServices: StaticServices,
  ) {}

  ngOnInit() {
    this.staticServices.getData().subscribe(responseData => {
      console.log(responseData);
      this.todos = responseData;
    });
  }

  onAddTodo() {
    this.router.navigate(['add']);
  }
}
