import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of, Observable } from 'rxjs';
import { Router } from '@angular/router';

import { InstanceTodo } from './todo.interface';
import { TodoListComponent } from './todo-list.component';
import { RestTodoService } from '../services/rest-todo.service';
import { StaticServices } from '../services/static-data.service';
import { AppComponent } from '../app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppModule } from '../app.module';

describe('TodoListComponent', () => {
  let component: TodoListComponent;
  let fixture: ComponentFixture<TodoListComponent>;
  let todo: InstanceTodo[];
  todo = [
    {
      done: false,
      snapshot: null,
      id: 'e7baf360-62ab-11ea-9aa1-bfe975c69bbf',
      description: 'test more reset',
      deadline: new Date('2021-03-03T17:00:00.000Z'),
    },
    {
      done: false,
      snapshot: null,
      id: 'b503a280-62ad-11ea-9aa1-bfe975c69bbf',
      description: 'more todo',
      deadline: new Date('2021-03-19T17:00:00.000Z'),
    },
  ];

  beforeEach(async(() => {
    const restServices = jasmine.createSpyObj('RestTodoService', [
      'getTodo',
      'patchTodo',
      'deleteTodo',
    ]);
    restServices.getTodo.and.returnValue(of(todo));
    restServices.patchTodo.and.returnValue(of<any[]>());
    restServices.deleteTodo.and.returnValue(of(true));
    const staticServices = jasmine.createSpyObj('StaticServices', [
      'observableNewData',
      'getNewDataList',
      'resetNewDataList',
    ]);
    staticServices.observableNewData.and.returnValue(of());
    staticServices.getNewDataList.and.returnValue([]);
    staticServices.resetNewDataList.and.returnValue();

    TestBed.configureTestingModule({
      declarations: [TodoListComponent],
      imports: [AppModule],
      providers: [
        { provide: StaticServices, useValue: staticServices },
        { provide: Router, useValue: Router },
        { provide: RestTodoService, useValue: restServices },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TodoListComponent);
    component = fixture.componentInstance;
    spyOn(window, 'confirm').and.returnValue(true);
    fixture.detectChanges();
  });

  it('should delete todo', () => {
    component.onConfirmDelete(todo[0]);
    console.log(component.notification);

    expect(component.notification).toEqual({
      type: 'success',
      message: 'Todos selected has gone',
    });
  });
});
