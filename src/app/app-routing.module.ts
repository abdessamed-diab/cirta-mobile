import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LoginComponent} from './login/login.component';
import {AuthGuard} from './login/auth.guard';

const routes: Routes = [
    {path: 'home', loadChildren: () => import('./home/home.module').then(m => m.HomeModule), canActivate: [AuthGuard] },
    {path: ':key', component: LoginComponent},
    {path: 'lang/:language', component: LoginComponent, pathMatch: 'full'},
    {path: '**',   component: LoginComponent}
  ];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
