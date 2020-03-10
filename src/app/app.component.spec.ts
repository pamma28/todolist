import { TestBed, async } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { NavbarComponent } from './navbar/navbar.component';
import { StaticServices } from './services/static-data.service';
import { NO_ERRORS_SCHEMA } from '@angular/compiler';
import { AuthComponent } from './auth/auth.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    let todoList = [];

    // Create a fake TwainService object with a `getQuote()` spy
    const staticServices = jasmine.createSpyObj('StaticServices', ['getData']);
    // Make the spy return a synchronous Observable with the test data
    todoList = staticServices.getData.and.returnValue(of(todoList));
    TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [AppComponent, NavbarComponent, AuthComponent],
      providers: [{ provide: StaticServices, useValue: staticServices }],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  // it(`should have as title 'todolist'`, () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   const app = fixture.debugElement.componentInstance;
  //   expect(app.title).toEqual('todolist');
  // });
});
