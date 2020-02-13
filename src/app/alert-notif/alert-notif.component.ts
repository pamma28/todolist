import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-alert-notif',
  templateUrl: './alert-notif.component.html',
  styleUrls: ['./alert-notif.component.css'],
})
export class AlertNotifComponent implements OnInit {
  @Input() notification: {
    type: string;
    message: string;
  };

  constructor() {}

  ngOnInit() {}

  onDismisAlert() {
    this.notification = undefined;
  }
}
