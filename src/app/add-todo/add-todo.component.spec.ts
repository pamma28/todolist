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
