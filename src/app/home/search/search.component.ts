import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {HomeService} from '../home.service';
import {HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {SearchableSummaryItem} from '../models/SearchableSummaryItem';

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

  constructor(private homeService: HomeService) { }

  ngOnInit(): void {
  }

  onSelectedBookItem(bookItemId: number): void {
    console.log('selected book item id: ', bookItemId);
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

    if (this.searchInput.value.length <= 2) {
      this.items = [];
    }
  }

  onResetSearchInput(event: KeyboardEvent): void {
    if (event.code === 'Enter') {
      this.searchInput.setValue('');
      this.items = [];
    }
  }

}
