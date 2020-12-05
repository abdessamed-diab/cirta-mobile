import { Component, OnInit } from '@angular/core';
import {LoginService} from './login.service';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  pseudoName = new FormControl('');
  password   = new FormControl('');

  constructor(public loginService: LoginService) { }

  ngOnInit(): void {
  }

  onFacebookSignIn(form: HTMLFormElement): void {
    form.submit();
  }

}
