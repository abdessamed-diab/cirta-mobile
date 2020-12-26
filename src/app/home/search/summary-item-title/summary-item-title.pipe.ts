import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'summaryItemTitle'
})
export class SummaryItemTitlePipe implements PipeTransform {

  transform(title: string, searchValueInput: string): unknown {
    const regExp = new RegExp(searchValueInput, 'ig');
    return title.replace(regExp, `<strong>${searchValueInput}</strong>`);
  }

}
