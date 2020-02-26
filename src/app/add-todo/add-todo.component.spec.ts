import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTodoComponent } from './add-todo.component';
import { StaticServices } from '../services/static-data.service';
import { NavbarComponent } from '../navbar/navbar.component';
import { of } from 'rxjs';

describe('AddTodoComponent', () => {
  let component: AddTodoComponent;
  let fixture: ComponentFixture<AddTodoComponent>;
  beforeEach(async(() => {
    let todoList = [];
    const staticServices = jasmine.createSpyObj('StaticServices', ['getData']);
    todoList = staticServices.getData.and.returnValue(of(todoList));
    window.history.pushState({ todo: null}, '', '');
    TestBed.configureTestingModule({
      declarations: [AddTodoComponent, NavbarComponent],
      providers: [{ provide: StaticServices, useValue: staticServices }],
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
});
