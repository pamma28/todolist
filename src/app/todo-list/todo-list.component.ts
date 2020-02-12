import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-todo-list',
  templateUrl: './todo-list.component.html',
  styleUrls: ['./todo-list.component.css'],
})
export class TodoListComponent implements OnInit {
  user = [];
  todos = [
    {
      id: 1,
      description: 'asdsahdasjdhsajd',
      deadline: new Date(),
      done: false,
    },
    {
      id: 2,
      description: 'klfhkhsdkjfhsdjkf',
      deadline: new Date(),
      done: true,
    },
  ];

  constructor(private router: Router, private activeRoute: ActivatedRoute) {}
  ngOnInit() {
    // this.activeRoute.params.subscribe((data: Params) => {
    //   this.user.push({ name: data['name'], level: data['level'] });
    // });
  }

  onAddTodo() {
    this.router.navigate(['add']);
  }
}
