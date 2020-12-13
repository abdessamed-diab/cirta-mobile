import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import { BookChartComponent } from './book-chart/book-chart.component';


@NgModule({
  declarations: [BookChartComponent],
  imports: [
    CommonModule,
    HomeRoutingModule
  ],
  bootstrap: [BookChartComponent]
})
export class HomeModule { }
