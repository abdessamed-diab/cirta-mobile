import { Component, OnInit } from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Book} from './models/Book';
import {HomeService} from './home.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  books: Book[];
  constructor(private homeService: HomeService) {}

  ngOnInit(): void {
    this.loadFavoriteBook();
  }

  loadFavoriteBook(): void {
    this.homeService.getFavoritesBookResponse().subscribe(
      (book: HttpResponse<Book[]>) => this.books = book.body,
      (error: ErrorEvent) => console.log('error', error)
    );
  }
}
