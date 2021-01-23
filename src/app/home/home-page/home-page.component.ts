import {Component, EventEmitter, Inject, OnDestroy, OnInit} from '@angular/core';
import {HomeService} from '../home.service';
import {ActivatedRoute, Router} from '@angular/router';
import {VALUES_AR, VALUES_EN} from '../../translation/en';
import {HttpResponse} from '@angular/common/http';
import {Book} from '../models/Book';
import {UserProfile} from '../models/UserProfile';
import {DOCUMENT} from '@angular/common';
import {Notification} from './notification/Notification';
import {backendServer} from '../../../environments/environment';

@Component({
  selector: 'rahba-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit, OnDestroy {
  public language =  1;
  books: Book[];
  notifications: Notification[] = [];
  showNotificationChildView = false;
  source: EventSource;

  constructor(public homeService: HomeService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              @Inject(DOCUMENT) private document: Document) { }

  ngOnInit(): void {
    this.initPropsFromUrlParams();

    if (this.homeService.favoriteBooks === undefined) {
      this.loadFavoriteBook();
    }

    if (this.homeService.userProfile === undefined) {
      this.homeService.fetchUserProfile().subscribe(
        (response: HttpResponse<UserProfile>) => {
            this.homeService.userProfile = response.body;
          },
        (error) => {
          console.log('cannot fetch facebook user profile: ', error);
          this.homeService.userProfile = {username: 'Rahba', userProfileImage: ''}; // defaults
        }, () => {this.fetchTotalNotifications(); }
      );
    } else {
      this.fetchTotalNotifications();
    }
  }

  ngOnDestroy(): void {
    if (this.source) {
      this.source.close();
    }
  }

  private fetchTotalNotifications(): void {
    const url = `api/notifications/${this.homeService.userProfile.username}`;
    this.source = new EventSource(backendServer.dns + url , {withCredentials: false});

    this.source.addEventListener('message',
      (message: MessageEvent) => {
        const total = message.data;
        if (total) {
          this.homeService.totalNotifications = total;
        }

      }
    );
  }

  private loadFavoriteBook(): void {
    this.homeService.getFavoritesBookResponse().subscribe(
      (book: HttpResponse<Book[]>) => {this.books = book.body; this.homeService.favoriteBooks = book.body; },
      (error: ErrorEvent) => {
        console.log('error', error);
        localStorage.removeItem('jwt');
        this.router.navigateByUrl('/');
      }
    );
  }

  private initPropsFromUrlParams(): void {
    const paramMap = this.activatedRoute.snapshot.paramMap;

    if (paramMap.has('language')) {
      this.language = paramMap.get('language') === 'ar' ? 0 : 1;
      this.homeService.language = this.language;
    }

    this.document.documentElement.lang = this.language === 0 ? 'ar' : 'en';
  }

  notificationChildViewDestroyed(isDestroyed): void{
    if (isDestroyed) {
      this.showNotificationChildView = false;
    }
  }

  containsUncheckedNotifications(): boolean{
    const unchecked = this.notifications.find(
      (item, index) => !item.checked
    );

    return unchecked !== undefined;
  }

  public get values(): any {
    return this.language === 1 ? VALUES_EN : VALUES_AR;
  }
}
