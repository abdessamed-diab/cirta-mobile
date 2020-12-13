import {Component, Input, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Book} from '../../models/Book';
import {HomeService} from '../../home.service';
import {Router} from '@angular/router';

import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BookModalComponent} from './book-modal/book-modal.component';

interface DialogData {
  email: string;
}

@Component({
  selector: 'rahba-book-chart',
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.css']
})
export class BookChartComponent implements OnInit {
  books: Book[];
  email: string;

  constructor(public homeService: HomeService, private router: Router, public dialog: MatDialog) { }

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

  base64ToImg(base64txt: string): any {
      return {'background-image': 'url(data:image/jpg;base64,' + base64txt + ')'};
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BookModalComponent, {
      width: `${window.innerWidth / 2}px`, height: `${window.innerHeight / 2}px`,
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

  onCLick(event): void {
    console.log('event', event);
    this.openDialog();
  }

}
