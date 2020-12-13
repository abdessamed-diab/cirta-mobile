import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from './models/Book';
import {backendServer} from '../../environments/environment';
import {Router} from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getFavoritesBookResponse(): Observable<HttpResponse<Book[]>> {
    const jwt = localStorage.getItem('jwt');
    return this.httpClient.get<Book[]>(
      backendServer.dns + backendServer.favoritesBooks + '/1',
      {
        headers: {
          Authorization: `Bearer ${jwt}`,
          locale: navigator.language,
          Accept: 'application/json'
        },
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('');
  }
}
