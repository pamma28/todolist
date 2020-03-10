import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthComponent } from './auth.component';
import { Router, ActivatedRoute } from '@angular/router';
import { RestTodoService } from '../services/rest-todo.service';
import { of } from 'rxjs';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;

  beforeEach(async(() => {
    const restServices = jasmine.createSpyObj('RestTodoService', [
      'addTodo',
      'patchTodo',
      'completedTodo',
    ]);
    restServices.addTodo.and.returnValue(of(true));
    TestBed.configureTestingModule({
      declarations: [AuthComponent],
      providers: [
        { provide: ActivatedRoute },
        { provide: Router },
        { provide: RestTodoService, useValue: restServices },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create', () => {
  //   expect(component).toBeTruthy();
  // });
});
