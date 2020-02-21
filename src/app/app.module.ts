import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { NavbarComponent } from './navbar/navbar.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProgressTodoComponent } from './progress-todo/progress-todo.component';
import { AlertNotifComponent } from './alert-notif/alert-notif.component';
import { CanDeactivateGuard } from './add-todo/can-deactivate-guard.service';
import { HoverElementDirective } from './add-todo/style-directive';

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FontAwesomeModule,
  ],
  providers: [CanDeactivateGuard],
  bootstrap: [AppComponent],
})
export class AppModule {}
