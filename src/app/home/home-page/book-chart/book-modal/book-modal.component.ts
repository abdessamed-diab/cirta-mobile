import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Book} from '../../../models/Book';
import {HomeService} from '../../../home.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {PDFDocumentProxy} from 'ng2-pdf-viewer';

interface DialogData {
  email: string;
  book: Book;
  cadence: number;
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
  constructor(public dialogRef: MatDialogRef<BookModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              private homeService: HomeService) { }

  ngOnInit(): void {
    this.dialogRef.afterOpened().subscribe(
      () => this.updateArrayBuffer(this.nextPage)
    );
  }

  updateArrayBuffer(nextPage: number): void{
    this.homeService.streamPagesOfBook(this.data.book.id, this.data.book.sourceUrl, nextPage).subscribe(
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
      this.updateArrayBuffer(this.nextPage);
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
