import {HttpClient, HttpResponse} from '@angular/common/http';
import {backendServer} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthResponse} from './models/AuthResponse';
import {TempRequestBody} from './models/TempRequestBody';

@Injectable()
export class LoginService {
  backendServer: any;
  private lang: number;
  constructor(private httpClient: HttpClient) {
    this.backendServer = backendServer;
  }

  public logInUser(tempRequestBody: TempRequestBody, lang: string): Observable<HttpResponse<AuthResponse>> {
    return this.httpClient.post<AuthResponse>(
      backendServer.dns + backendServer.login,
      tempRequestBody ,
      {
        headers: {Accept: 'application/json', 'Content-Type': 'application/json', language: lang},
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  public set language(lang: number) {
    this.lang = lang;
    localStorage.setItem('language', lang + '');
    console.log('last language: ', localStorage.getItem('language'));
  }

  public get language(): number {
    if (this.lang) {
      return this.lang;
    }

    if (localStorage.getItem('language')) {
      return parseInt(localStorage.getItem('language'));
    }

    return 1;
  }


}
