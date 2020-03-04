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
  constructor(private restService: RestTodosService, private router: Router) {
    this.restService.obsUserLoggedIn().subscribe((loggedIn: boolean) => {
      this.loggedIn = loggedIn;
    });
  }
  private loggedIn = false;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.loggedIn) {
      this.router.navigate(['/auth/login']);
    }
    return true;
  }
}
