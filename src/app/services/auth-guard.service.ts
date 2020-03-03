import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { RestTodosService } from './rest-todos.service';

export class AuthGuard implements CanActivate {
  constructor(private restService: RestTodosService) {}
  loggedIn = false;
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    this.restService.obsUserLoggedIn().subscribe((loggedIn: boolean) => {
      this.loggedIn = loggedIn;
    });
    return this.loggedIn;
  }
}
