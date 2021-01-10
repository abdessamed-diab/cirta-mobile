import { Component, OnInit } from '@angular/core';
import {HomeService} from '../home.service';
import {ActivatedRoute, Router} from '@angular/router';
import {VALUES_AR, VALUES_EN} from '../../translation/en';
import {HttpResponse} from '@angular/common/http';
import {Book} from '../models/Book';
import {UserProfile} from '../models/UserProfile';

@Component({
  selector: 'rahba-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  public language =  1;
  books: Book[];
  constructor(public homeService: HomeService, private activatedRoute: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.initPropsFromUrlParams();

    if (this.homeService.favoriteBooks === undefined) {
      this.loadFavoriteBook();
    }

    if (this.homeService.userProfile === undefined) {
      this.homeService.fetchUserProfile().subscribe(
        (response: HttpResponse<UserProfile>) => {this.homeService.userProfile = response.body; },
        (error) => {
          console.log('cannot fetch facebook user profile: ', error);
          this.homeService.userProfile = {username: 'Rahba', userProfileImage: ''}; // defaults
        }
      );
    }
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
    }
  }

  public get values(): any {
    return this.language === 1 ? VALUES_EN : VALUES_AR;
  }
}
