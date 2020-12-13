import {Component, Input, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Book} from '../models/Book';
import {HomeService} from '../home.service';
import {Router} from '@angular/router';

@Component({
  selector: 'rahba-book-chart',
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.css']
})
export class BookChartComponent implements OnInit {
  backgroundImageStyle = {};
  books: Book[];

  constructor(public homeService: HomeService, private router: Router) { }

  ngOnInit(): void {
    this.loadFavoriteBook();
  }

  loadFavoriteBook(): void {
    this.homeService.getFavoritesBookResponse().subscribe(
      (book: HttpResponse<Book[]>) => this.books = book.body,
      (error: ErrorEvent) => {
        console.log('error', error);
        localStorage.removeItem('jwt');
        this.router.navigateByUrl('/');
      }
    );
  }

  onCLick(event): void {
    console.log('event', event);
  }

  base64ToImg(base64txt: string): any {
      return {'background-image': 'url(data:image/jpg;base64,' + base64txt + ')'};
  }

}
