import {Component, Input, OnInit} from '@angular/core';
import {HttpResponse} from '@angular/common/http';
import {Book} from '../../models/Book';
import {HomeService} from '../../home.service';
import {Router} from '@angular/router';

import {MatDialog} from '@angular/material/dialog';
import {BookModalComponent} from './book-modal/book-modal.component';
import {BookChartModalData} from '../../models/Bookmarks';

@Component({
  selector: 'rahba-book-chart',
  templateUrl: './book-chart.component.html',
  styleUrls: ['./book-chart.component.css']
})
export class BookChartComponent implements OnInit {

  email: string;
  selectedBook: Book;
  modalData: BookChartModalData;
  loaded = true;
  constructor(public homeService: HomeService, private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {
  }

  base64ToImg(base64txt: string): any {
      return {'background-image': 'url(data:image/jpg;base64,' + base64txt + ')'};
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BookModalComponent, {
      width: `${window.innerWidth}px`, height: `${window.innerHeight}px`,
      minWidth: '100%',
      data: {
        book: this.selectedBook,
        cadence: 5,
        modalData: this.modalData,
        startPage: 0
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.email = result;
    });
  }

  loadBookmarks(): void {
    this.homeService.loadBookBookmarks(this.selectedBook.id, this.selectedBook.sourceUrl).subscribe(
      (response: HttpResponse<BookChartModalData>) => {
        this.modalData = response.body;
        this.modalData.userPicture = this.homeService.userProfile.userProfileImage;
        this.loaded = true;
        this.openDialog();
        },
      error => {console.log('error: ', error); this.homeService.logout(); }
    );
  }

  onCLick(selectedBook: Book): void {
    this.selectedBook = selectedBook;
    this.loaded = false;
    this.loadBookmarks();
  }

  onLeftArrowClick(event): void {
    const element = document.getElementsByClassName('flex-container')[0];
    element.scrollLeft = element.scrollLeft + 50;
  }

  onRightArrowClick(event): void {
    const element = document.getElementsByClassName('flex-container')[0];
    element.scrollLeft = element.scrollLeft - 50;
  }

}
