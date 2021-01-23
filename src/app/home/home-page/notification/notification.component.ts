import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {HomeService} from '../../home.service';
import {Notification} from './Notification';
import {HttpResponse} from '@angular/common/http';

@Component({
  selector: 'rahba-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit, OnDestroy {

  @Output()
  destroyEvent = new EventEmitter<boolean>();

  notifications: Notification[] = [];

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
    this.homeService.fetchNotification().subscribe(
      (response: HttpResponse<Notification[]>) => {
        this.notifications = response.body;
      },
      (error) => {
        console.log(error);
        if (error.status === 401) {
          this.homeService.logout();
        }
      }
    );
    // this.loadNotifications();
  }

  title(type: string): string {
    if (type === 'comment') {
      return 'replied to your question:';
    }
  }

  ngOnDestroy(): void {
    this.destroyEvent.emit(true);
  }

}
