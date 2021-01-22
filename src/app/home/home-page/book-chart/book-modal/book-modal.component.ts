import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Book} from '../../../models/Book';
import {HomeService} from '../../../home.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {PDFDocumentProxy} from 'ng2-pdf-viewer';
import {BookChartModalData} from '../../../models/Bookmarks';
import {Comment} from '../../../models/Comment';
import {CommentComponent} from '../../comment/comment.component';

interface DialogData {
  book: Book;
  cadence: number;
  modalData: BookChartModalData;
  startPage: number;
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
  pageComments: Comment[] = [];
  currentPage: number;

  @ViewChild(CommentComponent)
  commentCmp: CommentComponent;

  constructor(public dialogRef: MatDialogRef<BookModalComponent>,
              @Inject(MAT_DIALOG_DATA) public data: DialogData,
              public homeService: HomeService) { }

  ngOnInit(): void {
    this.nextPage = this.data.startPage > 0 ? this.data.startPage : this.nextPage;
    this.dialogRef.afterOpened().subscribe(
      () => this.updateArrayBuffer()
    );

  }

  updateArrayBuffer(): void{
    this.currentPage = this.nextPage;

    this.homeService.fetchComments(this.data.book.id, this.currentPage).subscribe(
      (response: HttpResponse<Comment[]>) => {
        if (response.body !== null && response.body !== undefined && response.body.length > 0) {
          this.pageComments = response.body;
        } else {
          this.pageComments = [];
        }
      },
      (error) => {console.log('error fetch comments: ', error) ; }
    );

    this.homeService.streamPagesOfBook(this.data.book.id, this.data.book.sourceUrl, this.nextPage).subscribe(
      (responseOutputStream: ArrayBuffer) => {
        this.src = {
          data: responseOutputStream,
          pdfBug: false,
          disableStream: true,
          disableAutoFetch: true
        };
        this.loaded = true;
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
    this.currentPage = this.nextPage + targetPage - 1;
  }

  callBackAfterLoadComplete(pdfDocumentProxy: PDFDocumentProxy): void {
    this.pdfDocument = pdfDocumentProxy;
    this.viewerContainer =  document.getElementsByClassName('ng2-pdf-viewer-container')[0] as HTMLDivElement;
    this.viewerContainer.addEventListener('scroll', this.onscroll.bind(this));
    this.canRefresh = true;
  }

  private onscroll(): void {
    const scrollingAmount = parseInt(this.viewerContainer.scrollHeight - this.viewerContainer.scrollTop + '');
    const topPosition = parseInt(this.viewerContainer.clientHeight + '');
    if ( scrollingAmount <= topPosition) {
      this.loaded = false;
      this.canRefresh = false;
      this.nextPage += this.data.cadence;
      this.updateArrayBuffer();
    }
  }

  onCloseModal(): void {
    this.commentCmp.closeFetchEvent(undefined);
    this.dialogRef.close();
  }

  toggleShowSummary(): void {
    this.showSummary = !this.showSummary;
  }

  keys(): string[] {
    return Object.keys(this.data.modalData.bookmarks);
  }

  goToPage(page: number): void {
    this.loaded = false;
    this.canRefresh = false;
    // this.showSummary = false;
    this.nextPage = page + 1; // check why we should add this 1!
    this.updateArrayBuffer();
  }

  onCallLogout(callLogout: boolean): void {
    if (callLogout) {
      console.log('callLogout event is fired.');
      this.onCloseModal();
      this.homeService.logout();
    }
  }

}
