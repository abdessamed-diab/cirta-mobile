import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'rahba-book-chart',
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.css']
})
export class BookChartComponent implements OnInit {
  bookTitle: string;
  constructor() { }

  ngOnInit(): void {
    this.bookTitle = 'اسم الكتاب هنا.';
  }

  onCLick(event): void {
    console.log('event', event);
  }

}
