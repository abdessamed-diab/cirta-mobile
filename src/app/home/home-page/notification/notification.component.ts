import {Component, OnDestroy, OnInit} from '@angular/core';
import {HomeService} from '../../home.service';

@Component({
  selector: 'rahba-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

}
