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
  hiddenWarnMessage = true;

  constructor(public loginService: LoginService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    if (localStorage.getItem('jwt') !== null) {
      this.router.navigateByUrl('/home');
    } else {
      this.loginUser();
      // this.pseudoName.disable({onlySelf: true, emitEvent: false});
      // this.password.disable({onlySelf: true, emitEvent: false});
    }
  }

  private loginUser(): void{
    this.activatedRoute.paramMap.pipe(
      switchMap(
        (params: ParamMap) => {
          const tempRequestBody = {key: params.get('key'), username: undefined, password: undefined};
          return params.has('key') ? this.loginService.logInUser(tempRequestBody) : new Observable();
        }
      )
    ).subscribe(
      (response: HttpResponse<AuthResponse>) => {
          this.storeJwtAndRedirect(response.body.jwtToken);
        },
      (error: ErrorEvent) => console.log('error', error)
    );

  }

  onFacebookSignUp(form: HTMLFormElement): void {
    form.submit();
  }

  onEnter(): void {
    const tempRequestBody = {key: undefined, username: this.pseudoName.value, password: this.password.value};
    this.loginService.logInUser(tempRequestBody).subscribe(
      (response: HttpResponse<AuthResponse>) => {
        this.storeJwtAndRedirect(response.body.jwtToken);
      },
        error => {console.log('error onEnter: ', error);  this.hiddenWarnMessage = false; }
    );
  }

  private storeJwtAndRedirect(jwt: string): void {
    if (jwt !== 'empty') {
      localStorage.setItem('jwt', jwt);
      this.router.navigateByUrl('/home');
    }
  }

  toggleHiddenWarnMessage(): void {
    this.hiddenWarnMessage = !this.hiddenWarnMessage;
  }

}
