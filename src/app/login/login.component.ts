import { Component, OnInit } from '@angular/core';
import {LoginService} from './login.service';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, ParamMap, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {AuthResponse} from './models/AuthResponse';
import {switchMap} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  pseudoName = new FormControl('');
  password   = new FormControl('');

  constructor(public loginService: LoginService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (localStorage.getItem('jwt') !== null) {
      this.router.navigateByUrl('/home');
    } else {
      this.loginUser();
      this.pseudoName.disable({onlySelf: true, emitEvent: false});
      this.password.disable({onlySelf: true, emitEvent: false});
    }
  }

  private loginUser(): void{
    this.activatedRoute.paramMap.pipe(
      switchMap(
        (params: ParamMap) => {
           return params.has('key') ? this.loginService.isLoggedIn({key: params.get('key')}) : new Observable();
        }
      )
    ).subscribe(
      (response: HttpResponse<AuthResponse>) => {
        const jwt = response.body.jwtToken;
        if (jwt !== 'empty') {
          localStorage.setItem('jwt', jwt);
          this.router.navigateByUrl('/home');
        }
        },
      (error: ErrorEvent) => console.log('error', error)
    );

  }

  onFacebookSignUp(form: HTMLFormElement): void {
    form.submit();
  }

}
