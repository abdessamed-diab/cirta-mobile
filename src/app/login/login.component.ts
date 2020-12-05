import { Component, OnInit } from '@angular/core';
import {LoginService} from './login.service';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  pseudoName = new FormControl('');
  password   = new FormControl('');

  constructor(public loginService: LoginService, private router: Router) { }

  ngOnInit(): void {
    this.pseudoName.disable({onlySelf: true, emitEvent: false});
    this.password.disable({onlySelf: true, emitEvent: false});
    if (this.router.url.startsWith('/home')) {
      this.router.navigateByUrl('/home');
    }
  }

  onFacebookSignIn(form: HTMLFormElement): void {
    form.submit();
  }

}
