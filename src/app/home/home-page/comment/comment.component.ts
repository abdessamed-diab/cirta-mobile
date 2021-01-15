import {Component, Input, OnInit} from '@angular/core';
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
        temp: true,
      };

      this.homeService.postComment(this.book.id, comment).subscribe(
        (response: HttpResponse<Comment>) => {
          this.input.setValue('');
          this.comments.unshift(response.body);
          console.log('posted comment: ', response.body) ;
          },
      (error) => {console.log('post comment error: ', error) ; }
      );
    }

  }

  showReplyBox(element: HTMLDivElement, parent: Comment ): void {
    this.addReplyToComment(parent);
    element.style.display = 'flex';
  }

  private addReplyToComment(comment: Comment): void {
    if (comment.replies === undefined) {
      comment.replies = [];
    }

    const newComment = {
      id: undefined,
      userProfile: this.homeService.userProfile,
      book: this.book,
      pageNumber: this.currentPage,
      content: this.input.value,
      publishedAt: '',
      badge: 'badge-dark',
      replies: [],
      temp: true,
    };

    comment.replies.unshift(newComment);
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
      temp: true,
    };

    this.homeService.addCommentToParent(newComment, parent.id).subscribe(
      (response: HttpResponse<Comment[]>) => {
        parent.replies = response.body;
        replyBoxElement.style.display = 'none';
        textarea.value = '';
      },
      (error) => {
        // TODO you should show this div element in RED.
        replyBoxElement.remove();
        console.log(error);
      }
    );
  }

}
