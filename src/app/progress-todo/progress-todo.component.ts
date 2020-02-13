import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-progress-todo',
  templateUrl: './progress-todo.component.html',
  styleUrls: ['./progress-todo.component.css'],
})
export class ProgressTodoComponent implements OnInit {
  @Input() totalDone: number;
  @Input() totalNotDone: number;
  constructor() {}

  ngOnInit() {}
}
