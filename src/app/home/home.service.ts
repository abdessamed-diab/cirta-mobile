import { Injectable } from '@angular/core';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from './models/Book';
import {backendServer} from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private httpClient: HttpClient) {
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
}
