import {HttpClient, HttpResponse} from '@angular/common/http';
import {backendServer} from '../../environments/environment';
import {Injectable} from '@angular/core';

@Injectable()
export class LoginService {
  backendServer: any;
  constructor(private httpClient: HttpClient) {
    this.backendServer = backendServer;
  }

  // TODO ad requested resource do not contain Allow Cross Origin request
  private fbLogin(): void {
    this.httpClient.post(backendServer.dns + backendServer.signInUrl, 'scope=public_profile', {
      headers: {
        'Content-type': 'application/x-www-form-urlencoded',
        'Access-Control-Allow-Origin': '*'
      }
    }).subscribe((response: HttpResponse<any>) => {
      const keys = response.headers.keys();
      console.log('OK', response.status);
    },
      (error: any) => console.log('FUCK!: ', error.error)
    );
  }


}
