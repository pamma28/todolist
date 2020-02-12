import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-todo',
  templateUrl: './progress-todo.component.html',
  styleUrls: ['./progress-todo.component.css'],
})
export class ProgressTodoComponent implements OnInit {
  @Input('totalDone') done: number;
  @Input('totalNotDone') notDone: number;
  constructor() {}

  ngOnInit() {}
}
