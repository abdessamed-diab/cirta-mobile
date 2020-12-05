import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {LoginService} from '../login/login.service';

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule
  ],
  exports: [LoginComponent],
  providers: [LoginService]
})
export class AuthenticationModule { }
