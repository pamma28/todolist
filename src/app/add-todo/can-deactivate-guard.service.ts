import { CanComponentDeactivate } from './can-deactivate-guard.interface';
import {
  CanDeactivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';

export class CanDeactivateGuard
  implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(
    component: CanComponentDeactivate,
    currentRoute: ActivatedRouteSnapshot,
    activeState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot,
  ) {
    return component.canDeactivate();
  }
}
