import { Component, OnInit } from '@angular/core';
import { RestTodosService } from '../services/rest-todos.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private restService: RestTodosService, private router: Router) {}
  userLoggedIn = false;
  ngOnInit() {
    this.restService.obsUserLoggedIn().subscribe(loggedIn => {
      this.userLoggedIn = loggedIn;
    });
  }

  doLogout() {
    this.restService.setToken(null);
    this.router.navigate(['/auth/login']);
  }
}
