import {Component, DoCheck, OnDestroy, OnInit} from '@angular/core';
import {LoginService} from './login.service';
import {FormControl} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpResponse} from '@angular/common/http';
import {AuthResponse} from './models/AuthResponse';
import {Observable, of} from 'rxjs';
import {VALUES_AR, VALUES_EN} from '../translation/en';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy, DoCheck {
  pseudoName = new FormControl('');
  password   = new FormControl('');
  hiddenWarnMessage = true;
  loading = false;

  constructor(public loginService: LoginService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    console.log('onInit');
    if (localStorage.getItem('jwt') !== null) {
      this.router.navigateByUrl(`/home/${this.loginService.language === 1 ? 'en' : 'ar'}`);
    } else {
      this.loading = false;
      this.loginUser();
      // this.pseudoName.disable({onlySelf: true, emitEvent: false});
      // this.password.disable({onlySelf: true, emitEvent: false});
    }
  }

  ngOnDestroy(): void {
    console.log('onDestroy');
  }

  ngDoCheck(): void {
    console.log('do check');
    this.loading = false;
  }

  private loginUser(): void{
    this.params.subscribe(
      (response: HttpResponse<AuthResponse>) => {
          response.status !== 404 ? this.storeJwtAndRedirect(response.body) : this.loading = false;
        },
      (error: ErrorEvent) => { console.log('error', error); this.loading = false; },
      () => this.loading = false
    );
  }

  private get params(): Observable<HttpResponse<AuthResponse>> {
    const paramMap = this.activatedRoute.snapshot.paramMap;
    if (paramMap.has('key')) {
      const tempRequestBody = {key: paramMap.get('key'), username: undefined, password: undefined};
      return this.loginService.logInUser(tempRequestBody, `${this.loginService.language}`);
    }

    if (paramMap.has('language')) {
      this.loginService.language = paramMap.get('language') === 'ar' ? 0 : 1;
    }
    return of<HttpResponse<AuthResponse>>(new HttpResponse({status: 404}));
  }

  onFacebookSignIn(form: HTMLFormElement): void {
    this.loading = true;
    this.pseudoName.setValue('');
    this.password.setValue('');
    form.submit();
    this.ngOnDestroy();
  }

  onEnter(): void {
    this.loading = true;
    const tempRequestBody = {key: undefined, username: this.pseudoName.value, password: this.password.value};
    this.loginService.logInUser(tempRequestBody, `${this.loginService.language}`).subscribe(
      (response: HttpResponse<AuthResponse>) => {
        this.storeJwtAndRedirect(response.body);
      },
        error => {console.log('error onEnter: ', error);  this.hiddenWarnMessage = false; this.loading = false; },
      () => this.loading = false
    );
  }

  private storeJwtAndRedirect(authResponse: AuthResponse): void {
    if (authResponse.jwtToken !== 'empty') {
      localStorage.setItem('jwt', authResponse.jwtToken);
      this.router.navigateByUrl(`/home/${authResponse.language === 1 ? 'en' : 'ar'}`);
    }
  }

  toggleHiddenWarnMessage(): void {
    this.hiddenWarnMessage = !this.hiddenWarnMessage;
  }

  public get values(): any {
    return this.loginService.language === 1 ? VALUES_EN : VALUES_AR;
  }

  onSelectChange(targetValue: string): void {
    this.loginService.language = targetValue === 'en' ? 1 : 0;
  }

}
