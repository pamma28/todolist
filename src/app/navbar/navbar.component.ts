import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(private restService: AuthService, private router: Router) {}
  userLoggedIn = false;
  ngOnInit() {
    this.userLoggedIn = this.restService.getToken() !== null ? true : false;
    this.restService.obsUserLoggedIn().subscribe(loggedIn => {
      this.userLoggedIn = loggedIn;
    });
  }

  doLogout() {
    this.restService.logout();
  }
}
