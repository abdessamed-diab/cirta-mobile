import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {HomeService} from '../home.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {SearchableSummaryItem} from '../models/SearchableSummaryItem';
import {Book} from '../models/Book';
import {Bookmarks} from '../models/Bookmarks';
import {MatDialog} from '@angular/material/dialog';
import {BookModalComponent} from '../home-page/book-chart/book-modal/book-modal.component';

interface DialogData {
  book: Book;
  cadence: number;
  bookmarks: Bookmarks;
  startPage: number;
}

@Component({
  selector: 'rahba-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  // TODO ad we need perhaps new model to represent full book coordinates. book id, name, sourceUrl and page number or summary!
  items: SearchableSummaryItem[] = [];
  searchInput = new FormControl('');
  private tab: string[] = ['ArrowRight', 'ArrowLeft', 'Enter', 'ArrowDown', 'ArrowUp'];
  maxResultSet =  10;
  selectedSummaryItemNumber = 0;

  constructor(private homeService: HomeService, public dialog: MatDialog) { }

  ngOnInit(): void {
  }

  onSelectedBookItem(searchableSummaryItem: SearchableSummaryItem): void {
    const dialogRef = this.dialog.open(BookModalComponent, {
      width: `${window.innerWidth}px`, height: `${window.innerHeight}px`,
      minWidth: '100%',
      data: {
        book: {
          id: searchableSummaryItem.bookId,
          sourceUrl: searchableSummaryItem.bookSourceUrl
        },
        cadence: 5,
        bookmarks: {bookmark: {}},
        startPage: searchableSummaryItem.page + 1
      }
    });
  }

  onSearchInputKeyUp(event: KeyboardEvent): void{
    if (!this.tab.includes(event.code) && this.searchInput.value.length > 2) {

      this.homeService.autoCompleteKeyword(this.searchInput.value).subscribe(
        (response: HttpResponse<SearchableSummaryItem[]>) => { this.items = response.body; },
        (error: HttpErrorResponse) => {
          console.log('error: ', error);
          this.items = [];
          if (error.status === 401) {
            this.homeService.logout();
          }
        }
      );

    }

    if (event.code === 'ArrowDown' ) {
      const autocompleteDivElement: Element = document.getElementsByClassName('autocomplete-items')[0];
      autocompleteDivElement.getElementsByTagName('span')[this.selectedSummaryItemNumber].focus();
    }

    if (this.searchInput.value.length <= 2) {
      this.items = [];
    }
  }

  onSummaryItemKeyPress(autoComplete: HTMLDivElement, dawn: boolean): void {
    this.selectedSummaryItemNumber = dawn ? this.selectedSummaryItemNumber + 1 : this.selectedSummaryItemNumber - 1;
    if (this.selectedSummaryItemNumber < 0) {
      this.selectedSummaryItemNumber = 0;
    }

    if (this.selectedSummaryItemNumber >= this.items.length - 1 ) {
      this.selectedSummaryItemNumber = this.items.length - 1 ;
    }
    autoComplete.getElementsByTagName('span')[this.selectedSummaryItemNumber].focus();
  }

  onResetSearchInput(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.searchInput.setValue('');
      this.items = [];
    }
  }

}
