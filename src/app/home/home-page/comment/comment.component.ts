import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Comment} from '../../models/Comment';
import {FormControl} from '@angular/forms';
import {HomeService} from '../../home.service';
import {Book} from '../../models/Book';
import {HttpResponse} from '@angular/common/http';

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

  constructor(public homeService: HomeService) { }

  ngOnInit(): void {
  }

  postComment(): void {
    if (this.input.value.length > 0) {
      const comment = {
        id: undefined,
        userProfile: this.homeService.userProfile,
        book: this.book,
        pageNumber: this.currentPage,
        content: this.input.value,
        publishedAt: '',
        badge: 'badge-dark',
        replies: [],

        tempId: new Date().getTime(),
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
  }

  postReply(parent: Comment, textarea: HTMLTextAreaElement, replyBoxElement: HTMLDivElement): void {
    if (!textarea.value || textarea.value.length < 1 ) {
      replyBoxElement.style.display = 'none';
      return;
    }

    const newComment = {
      id: undefined,
      userProfile: this.homeService.userProfile,
      book: this.book,
      pageNumber: parent.pageNumber,
      content: textarea.value,
      publishedAt: '',
      badge: 'badge-dark',
      replies: undefined,

      tempId: new Date().getTime(),
    };

    if (!parent.replies || parent.replies === undefined) {
      parent.replies = [];
    }

    parent.replies.unshift(newComment);
    replyBoxElement.style.display = 'none';
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
          this.callLogout.emit(true);
        }
      }
    );

  }

}
