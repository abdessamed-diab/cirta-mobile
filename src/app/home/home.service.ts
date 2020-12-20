import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from './models/Book';
import {backendServer} from '../../environments/environment';
import {Router} from '@angular/router';
import {Bookmarks} from './models/Bookmarks';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getFavoritesBookResponse(): Observable<HttpEvent<Book[]>> {
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

  streamBookByBookId(bookId: number): Observable<HttpEvent<ArrayBuffer>> {
    return this.httpClient.get(
      backendServer.dns + 'book/stream/' + bookId,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          Accept: 'application/octet-stream', 'Content-Type': 'application/json'
        },
        observe: 'events',
        responseType: 'arraybuffer',
        reportProgress: true
      }
    );
  }

  streamPagesOfBook(bookId: number, sourceUrl: string, startPage: number): Observable<HttpEvent<ArrayBuffer>> {
    return this.httpClient.get(
      backendServer.dns + `book/stream/${bookId}/${startPage}`,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
          'source-url': sourceUrl
        },
        observe: 'events',
        responseType: 'arraybuffer',
        reportProgress: true
      }
    );
  }

  loadBookBookmarks(bookId: number, sourceUrl: string): Observable<HttpResponse<Bookmarks>> {
    return this.httpClient.get<Bookmarks>(
      backendServer.dns + `book/bookmark/${bookId}`,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
          'source-url': sourceUrl
        },
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  logout(): void {
    localStorage.removeItem('jwt');
    this.router.navigateByUrl('/'); // absolute
  }

  getJwt(): string {
    return localStorage.getItem('jwt');
  }
}
