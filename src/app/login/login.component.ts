import {Component, OnInit} from '@angular/core';
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
export class LoginComponent implements OnInit {
  pseudoName = new FormControl('');
  password   = new FormControl('');
  hiddenWarnMessage = true;
  loading = false;
  language = 1;

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
    this.params.subscribe(
      (response: HttpResponse<AuthResponse>) => {
          response.status !== 404 ? this.storeJwtAndRedirect(response.body.jwtToken) : this.loading = false;
        },
      (error: ErrorEvent) => { console.log('error', error); this.loading = false; },
      () => this.loading = false
    );
  }

  private get params(): Observable<HttpResponse<AuthResponse>> {
    const paramMap = this.activatedRoute.snapshot.paramMap;
    if (paramMap.has('key')) {
      const tempRequestBody = {key: paramMap.get('key'), username: undefined, password: undefined};
      return this.loginService.logInUser(tempRequestBody);
    }

    if (paramMap.has('language')) {
      this.language = paramMap.get('language') === 'ar' ? 0 : 1;
    }
    return of<HttpResponse<AuthResponse>>(new HttpResponse({status: 404}));
  }

  onFacebookSignUp(form: HTMLFormElement): void {
    this.loading = true;
    this.pseudoName.setValue('');
    this.password.setValue('');
    form.submit();
  }

  onEnter(): void {
    this.loading = true;
    const tempRequestBody = {key: undefined, username: this.pseudoName.value, password: this.password.value};
    this.loginService.logInUser(tempRequestBody).subscribe(
      (response: HttpResponse<AuthResponse>) => {
        this.storeJwtAndRedirect(response.body.jwtToken);
      },
        error => {console.log('error onEnter: ', error);  this.hiddenWarnMessage = false; this.loading = false; },
      () => this.loading = false
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

  public get values(): any {
    return this.language === 1 ? VALUES_EN : VALUES_AR;
  }

  onSelectChange(targetValue: string): void {
    this.language = targetValue === 'en' ? 1 : 0;
  }

}
