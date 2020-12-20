import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Book} from '../../../models/Book';
import {HomeService} from '../../../home.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {PDFDocumentProxy} from 'ng2-pdf-viewer';
import {Bookmarks} from '../../../models/Bookmarks';

interface DialogData {
  email: string;
  book: Book;
  cadence: number;
  bookmarks: Bookmarks;
}

@Component({
  selector: 'rahba-book-modal',
  templateUrl: './book-modal.component.html',
  styleUrls: ['./book-modal.component.css']
})
export class BookModalComponent implements OnInit {
  src: {};
  pdfDocument: PDFDocumentProxy;
  viewerContainer: HTMLDivElement;
  nextPage = 1;
  canRefresh = false;
  loaded = false;
  showSummary = false;
  constructor(public dialogRef: MatDialogRef<BookModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private homeService: HomeService) { }

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(
      () => this.updateArrayBuffer()
    );
  }

  updateArrayBuffer(): void{
    this.homeService.streamPagesOfBook(this.data.book.id, this.data.book.sourceUrl, this.nextPage).subscribe(
      (responseOutputStream: HttpResponse<ArrayBuffer>) => {
        if (responseOutputStream.type === 4) {
          if (responseOutputStream.body.byteLength > 0) {
            this.src = {
              data: responseOutputStream.body,
              pdfBug: false,
              disableStream: true,
              disableAutoFetch: true
            };
          } else {
            console.log('reach end of file, no page left.');
          }
          this.loaded = true;
        }
      },
      (error: HttpErrorResponse) => {
        console.log('book-modal: ', error);
        if (error.status === 401) {
          this.dialogRef.close();
          this.homeService.logout();
        }
      }
    );
  }

  onPageChange(targetPage: number): void {
  }

  callBackAfterLoadComplete(pdfDocumentProxy: PDFDocumentProxy): void {
    this.pdfDocument = pdfDocumentProxy;
    this.viewerContainer =  document.getElementsByClassName('ng2-pdf-viewer-container')[0] as HTMLDivElement;
    this.viewerContainer.addEventListener('scroll', this.onscroll.bind(this));
    this.canRefresh = true;
  }

  private onscroll(): void {
    if (this.viewerContainer.scrollTop + this.viewerContainer.clientHeight >= this.viewerContainer.scrollHeight && this.canRefresh) {
      this.loaded = false;
      this.canRefresh = false;
      this.nextPage += this.data.cadence;
      this.updateArrayBuffer();
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  toggleShowSummary(): void {
    this.showSummary = !this.showSummary;
  }

  keys(): string[] {
    return Object.keys(this.data.bookmarks);
  }

  goToPage(page: number): void {
    this.loaded = false;
    this.canRefresh = false;
    this.nextPage = page + 1; // check why we should add this 1!
    this.updateArrayBuffer();
  }

}
