import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {HomeRoutingModule} from './home-routing.module';
import {BookChartComponent} from './home-page/book-chart/book-chart.component';
import {BookModalComponent} from './home-page/book-chart/book-modal/book-modal.component';
import {HomePageComponent} from './home-page/home-page.component';
import {ReactiveFormsModule} from '@angular/forms';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDialogModule} from '@angular/material/dialog';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {PdfViewerModule} from 'ng2-pdf-viewer';
import {SearchComponent} from './search/search.component';
import { SummaryItemTitlePipe } from './search/summary-item-title/summary-item-title.pipe';
import { CommentComponent } from './home-page/comment/comment.component';
import { NotificationComponent } from './home-page/notification/notification.component';
import {MatBadgeModule} from '@angular/material/badge';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [HomePageComponent, BookChartComponent, BookModalComponent, SearchComponent, SummaryItemTitlePipe, CommentComponent, NotificationComponent],
    imports: [
        CommonModule,
        HomeRoutingModule,
        ReactiveFormsModule,
        MatDialogModule,
        MatFormFieldModule,
        MatButtonModule,
        MatInputModule,
        PdfViewerModule,
        MatBadgeModule,
        MatIconModule
    ],
  bootstrap: [HomePageComponent]
})
export class HomeModule { }
