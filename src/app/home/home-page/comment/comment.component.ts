import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from '../../models/Comment';
import {FormControl} from '@angular/forms';
import {HomeService} from '../../home.service';
import {Book} from '../../models/Book';
import {HttpResponse} from '@angular/common/http';
import {backendServer} from '../../../../environments/environment';
import {CommentHelper} from './CommentHelper';

@Component({
  selector: 'rahba-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css']
})
export class CommentComponent implements OnInit {
  @Input()
  language: number;

  @Input()
  index: number;

  @Input()
  book: Book;

  @Input()
  currentPage: number;

  input = new FormControl('');

  @Input()
  comments: Comment[] = [];

  @Output()
  callLogout = new EventEmitter<boolean>();

  sources: CommentHelper[] = [];

  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
  }

  postComment(): void {
    if (this.input.value.length > 0) {
      const comment = {
        id: undefined,
        userProfile: this.homeService.userProfile,
        bookId: this.book.id,
        pageNumber: this.currentPage,
        content: this.input.value,
        publishedAt: '',
        badge: 'badge-dark',
        replies: [],

        tempId: new Date().getTime(),
        persistedAt: '',
      };

      this.comments.unshift(comment);

      this.homeService.postComment(this.book.id, comment).subscribe(
        (response: HttpResponse<Comment>) => {
            this.input.setValue('');
            this.comments.forEach(
              (reference, index, tab) => {
                if (reference.tempId === response.body.tempId) {
                  tab[index] = response.body;
                }
              }
            );
          },
      (error) => {
          console.log('post comment error: ', error) ;
          if (error.status === 401) {
            this.closeFetchEvent(undefined);
            this.callLogout.emit(true);
          }
        }
      );
    }

  }

  showReplyBox(element: HTMLDivElement, parent: Comment ): void {
    if (parent.replies === undefined) {
      parent.replies = [];
    }

    element.style.display = 'flex';
    this.fetchEvent(parent, this.homeService.language);
  }

  private fetchEvent(parent: Comment, language: number): void {
    const url = parent.replies.length > 0
      ? `api/${parent.replies[0].id}/fetchNewChildren?language=${language}`
      : `api/${parent.id}/fetchNewChildren?language=${language}`;

    const source = new EventSource(backendServer.dns + url , {withCredentials: false});
    this.sources.unshift({parent, source} );

    source.addEventListener('message',
      (message: MessageEvent) => {
        const newestChildComments = JSON.parse(message.data);
        if (newestChildComments.length > 0) {
          for (let co = newestChildComments.length - 1 ; co >= 0 ; co -- ) {

            const existed = parent.replies.find(
              (item, index) => item.id === newestChildComments[co].id
            );

            if (!existed) {
              newestChildComments[co].badge = 'badge-info';
              parent.replies.unshift(newestChildComments[co]);
            }

          }
        }

      }
    );
  }

  postReply(parent: Comment, textarea: HTMLTextAreaElement, replyBoxElement: HTMLDivElement): void {
    if (!textarea.value || textarea.value.length < 1 ) {
      replyBoxElement.style.display = 'none';
      this.closeFetchEvent(parent);
      return;
    }

    const newComment = {
      id: undefined,
      userProfile: this.homeService.userProfile,
      bookId: this.book.id,
      pageNumber: parent.pageNumber,
      content: textarea.value,
      publishedAt: '',
      badge: 'badge-dark',
      replies: undefined,

      tempId: new Date().getTime(),
      persistedAt: '',
    };

    if (!parent.replies || parent.replies === undefined) {
      parent.replies = [];
    }

    parent.replies.unshift(newComment);
    replyBoxElement.style.display = 'none';
    this.closeFetchEvent(parent);
    textarea.value = '';

    this.homeService.addCommentToParent(newComment, parent.id).subscribe(
      (response: HttpResponse<Comment[]>) => {
        parent.replies = response.body;
      },
      (error) => {
        // TODO you should show this div element in RED.
        replyBoxElement.remove();
        console.log(error);
        if (error.status === 401) {
          this.closeFetchEvent(undefined);
          this.callLogout.emit(true);
        }
      }
    );

  }


  public closeFetchEvent(parent: Comment): void {
    if (parent) {
      this.sources.filter(
        (item, index) => item.parent.id === parent.id
      ).forEach(
        (item, index) => item.source.close()
      );
    } else {
      this.sources.forEach(
        (item, index) => item.source.close()
      );
    }
  }

}
