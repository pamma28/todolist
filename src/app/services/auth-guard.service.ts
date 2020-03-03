import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';
import { Injectable } from '@angular/core';
import { RestTodosService } from './rest-todos.service';
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private restService: RestTodosService, private router: Router) {}
  private loggedIn = false;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.restService.obsUserLoggedIn().subscribe((loggedIn: boolean) => {
      this.loggedIn = loggedIn;
    });
    if (!this.loggedIn) {
      this.router.navigate(['/auth/login']);
    }
    return this.loggedIn;
  }
}
