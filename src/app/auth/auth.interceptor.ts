import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { RestTodosService } from '../services/rest-todos.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private restService: RestTodosService) {}
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const token = this.restService.getToken();
    const authReq = req.clone({
      headers: req.headers.set('Authorization', 'Bearer ' + token),
    });
    return next.handle(authReq);
  }
}
