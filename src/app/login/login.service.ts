import {HttpClient, HttpResponse} from '@angular/common/http';
import {backendServer} from '../../environments/environment';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {AuthResponse} from './models/AuthResponse';
import {TempRequestBody} from './models/TempRequestBody';

@Injectable()
export class LoginService {
  backendServer: any;
  constructor(private httpClient: HttpClient) {
    this.backendServer = backendServer;
  }

  public logInUser(tempRequestBody: TempRequestBody): Observable<HttpResponse<AuthResponse>> {
    return this.httpClient.post<AuthResponse>(
      backendServer.dns + backendServer.login,
      tempRequestBody ,
      {
        headers: {Accept: 'application/json', 'Content-Type': 'application/json'},
        observe: 'response',
        responseType: 'json'
      }
    );
  }


}
