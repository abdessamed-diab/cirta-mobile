import {Injectable} from '@angular/core';
import {HttpClient, HttpEvent, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Book} from './models/Book';
import {backendServer} from '../../environments/environment';
import {Router} from '@angular/router';
import {BookChartModalData} from './models/Bookmarks';
import {SearchableSummaryItem} from './models/SearchableSummaryItem';
import {UserProfile} from './models/UserProfile';
import {Comment} from './models/Comment';
import {VALUES_AR, VALUES_EN} from '../translation/search';

@Injectable()
export class HomeService{
  private user: UserProfile = undefined;
  private favorites: Book[] = undefined;
  public language: number;
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

  public get favoriteBooks(): Book[] {
    return this.favorites;
  }

  public set favoriteBooks(books: Book[]) {
    this.favorites = books;
  }

  private streamBookByBookId(bookId: number): Observable<HttpEvent<ArrayBuffer>> {
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

  streamPagesOfBook(bookId: number, sourceUrl: string, startPage: number): Observable<ArrayBuffer> {
    return this.httpClient.get(
      backendServer.dns + `book/stream/${bookId}/${startPage}`,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          Accept: 'application/octet-stream',
          'Content-Type': 'application/json',
          'source-url': sourceUrl
        },
        observe: 'body',
        responseType: 'arraybuffer',
        reportProgress: true
      }
    );
  }

  loadBookBookmarks(bookId: number, sourceUrl: string): Observable<HttpResponse<BookChartModalData>> {
    return this.httpClient.get<BookChartModalData>(
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

  fetchUserProfile(): Observable<HttpResponse<UserProfile>> {
    return this.httpClient.get<UserProfile>(
      backendServer.dns + `search/user/profile`,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          Accept: 'application/json',
          'Content-Type': 'text/plain'
        },
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  public get userProfile(): UserProfile {
    return this.user;
  }

  public set userProfile(user: UserProfile) {
    this.user = user;
  }

  autoCompleteKeyword(keyword: string): Observable<HttpResponse<SearchableSummaryItem[]>> {
    return this.httpClient.get<SearchableSummaryItem[]>(
      backendServer.dns + `search/${keyword.toLowerCase()}`,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          content: 'application/json',
          Accept: 'application/json',
          'Content-Type': 'text/plain'
        },
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  postComment(bookId: number, body: Comment): Observable<HttpResponse<Comment>> {
    return this.httpClient.post<Comment>(
      backendServer.dns + `book/${bookId}/comment`,
      body,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          content: 'application/json',
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  fetchComments(bookId: number, pageNumber: number): Observable<HttpResponse<Comment[]>> {
    return this.httpClient.get<Comment[]>(
      backendServer.dns + `book/${bookId}/comments/${pageNumber}`,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          content: 'application/json',
          Accept: 'application/json',
          'Content-Type': 'application/json'
        },
        observe: 'response',
        responseType: 'json'
      }
    );
  }

  addCommentToParent(comment: Comment, parentId: number): Observable<HttpResponse<Comment[]>> {
    return this.httpClient.post<Comment[]>(
      backendServer.dns + `book/comment/addTo/${parentId}`,
      comment,
      {
        headers: {
          Authorization: `Bearer ${this.getJwt()}`,
          content: 'application/json',
          Accept: 'application/json',
          'Content-Type': 'application/json'
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

  public get values(): any {
    return this.language === 1 ? VALUES_EN : VALUES_AR;
  }
}
