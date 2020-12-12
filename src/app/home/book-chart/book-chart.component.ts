import {Component, Input, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Book} from '../models/Book';
import {HomeService} from '../home.service';

@Component({
  selector: 'rahba-book-chart',
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.css']
})
export class BookChartComponent implements OnInit {
  @Input()
  book: Book;
  backgroundImageStyle = {};

  constructor() { }

  ngOnInit(): void {
    this.setBackgroundImageStyle();
  }

  onCLick(event): void {
    console.log('event', event);
  }

  setBackgroundImageStyle(): void {
    this.backgroundImageStyle = {
      'background-image': 'url(assets/img/' + this.book.id + '.jpg)'
    };
    console.log('style: ', this.backgroundImageStyle);
  }

}
