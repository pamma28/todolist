import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProgressTodoComponent } from './progress-todo/progress-todo.component';
import { AlertNotifComponent } from './alert-notif/alert-notif.component';
import { HoverElementDirective } from './add-todo/style-directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AuthComponent } from './auth/auth.component';
import { StaticServices } from './services/static-data.service';
import { AuthService } from './services/auth.service';
import { AuthInterceptor } from './auth/auth.interceptor';
import { MaterialModule } from './material.module';
@NgModule({
  declarations: [
    AppComponent,
    TodoListComponent,
    AddTodoComponent,
    NavbarComponent,
    NotFoundComponent,
    ProgressTodoComponent,
    AlertNotifComponent,
    HoverElementDirective,
    AuthComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    MaterialModule,
  ],
  providers: [
    AuthService,
    StaticServices,
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
