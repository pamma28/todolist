import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTodoComponent } from './add-todo.component';
import { StaticServices } from '../services/static-data.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { of } from 'rxjs';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { AppModule } from '../app.module';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async(() => {
    let todoList = [];
    const staticServices = jasmine.createSpyObj('StaticServices', ['postData']);
    todoList = staticServices.postData.and.returnValue(of(todoList));
    window.history.pushState({ todo: null }, '', '');
    TestBed.configureTestingModule({
      imports: [AppModule, ReactiveFormsModule],
      declarations: [AddTodoComponent, NavbarComponent],
      providers: [
        { provide: StaticServices, useValue: staticServices },
        { provide: ReactiveFormsModule, useValue: formBuilder },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('form invalid when empty', () => {
    expect(component.newTodos.valid).toBeFalsy();
  });

  it('invalid past date', () => {
    component.newTodos.setValue({
      description: null,
      deadline: '2020-02-20',
      done: false,
      id: null,
    });
    expect(component.newTodos.get('deadline').valid).toBeFalsy();
  });

  it('valid todo creation', () => {
    component.newTodos.setValue({
      description: 'test with jasmine karma',
      deadline: '2021-02-20',
      done: false,
      id: null,
    });
    component.onSubmit();
    expect(component.notification).toEqual({
      type: 'success',
      message: 'Todos has been saved',
    });
  });
});

describe('EditTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  const formBuilder: FormBuilder = new FormBuilder();
  beforeEach(async(() => {
    let todoList = [];
    window.history.pushState(
      {
        todo: {
          id: 11,
          description: 'this is description',
          deadline: '2020-03-22',
          done: false,
        },
      },
      '',
      '',
    );

    const staticServices = jasmine.createSpyObj('StaticServices', [
      'updateData',
    ]);
    todoList = staticServices.updateData.and.returnValue(of(todoList));
    TestBed.configureTestingModule({
      imports: [AppModule, ReactiveFormsModule],
      declarations: [AddTodoComponent, NavbarComponent],
      providers: [
        { provide: StaticServices, useValue: staticServices },
        { provide: ReactiveFormsModule, useValue: formBuilder },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTodoComponent);
    component = fixture.debugElement.componentInstance;
    fixture.detectChanges();
  });

  it('form valid when no changes', () => {
    expect(component.newTodos.valid).toBeTruthy();
  });

  it('invalid if change into past date', () => {
    component.newTodos.setValue({
      description: window.history.state.todo.description,
      deadline: '2020-02-20',
      done: window.history.state.todo.done,
      id: window.history.state.todo.id,
    });
    expect(component.newTodos.get('deadline').valid).toBeFalsy();
  });

  it('valid todo update', () => {
    component.newTodos.setValue({
      description: window.history.state.todo.description + ' update',
      deadline: window.history.state.todo.deadline,
      done: window.history.state.todo.done,
      id: window.history.state.todo.id,
    });
    component.onSubmit();
    expect(component.notification).toEqual({
      type: 'success',
      message: 'Todos has been updated',
    });
  });
});
