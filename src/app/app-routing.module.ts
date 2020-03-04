import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TodoListComponent } from './todo-list/todo-list.component';
import { AddTodoComponent } from './add-todo/add-todo.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { CanDeactivateGuard } from './add-todo/can-deactivate-guard.service';
import { AuthComponent } from './auth/auth.component';
import { AuthGuard } from './services/auth-guard.service';

const routes: Routes = [
  { path: '', redirectTo: '/auth/login', pathMatch: 'full' },
  { path: 'home', component: TodoListComponent },
  { path: 'auth/:page', component: AuthComponent },
  {
    path: 'add',
    component: AddTodoComponent,
    canDeactivate: [CanDeactivateGuard],
    canActivate: [AuthGuard],
  },
  { path: 'edit', component: AddTodoComponent, canActivate: [AuthGuard] },
  { path: '404', component: NotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [CanDeactivateGuard, AuthGuard],
})
export class AppRoutingModule {}
