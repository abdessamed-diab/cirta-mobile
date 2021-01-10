import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePageComponent} from './home-page/home-page.component';
import {SearchComponent} from './search/search.component';
import {BookChartComponent} from './home-page/book-chart/book-chart.component';
import {HomeService} from './home.service';
import {AuthGuard} from '../login/auth.guard';

const routes: Routes = [
  { path: '',
    component: HomePageComponent,
    children: [
      {path: '', component: BookChartComponent, pathMatch: 'full'}
    ]
  },
  { path: 'search', component: SearchComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' }
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [HomeService]
})
export class HomeRoutingModule { }
