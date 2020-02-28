import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CanDeactivateGuard } from './add-todo/can-deactivate-guard.service';
import { AuthComponent } from './auth/auth.component';

const routes: Routes = [
  { path: '', component: TodoListComponent },
  { path: 'auth/:page', component: AuthComponent },
  {
    path: 'add',
    component: AddTodoComponent,
    canDeactivate: [CanDeactivateGuard],
  },
  { path: 'edit', component: AddTodoComponent },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
