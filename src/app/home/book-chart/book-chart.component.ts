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
  constructor() { }

  ngOnInit(): void {
  }

  onCLick(event): void {
    console.log('event', event);
  }

}
