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
        userProfile: this.homeService.userProfile,
        book: this.book,
        pageNumber: this.currentPage,
        content: this.input.value,
        publishedAt: '',
        badge: 'badge-dark',
        replies: []
      };

      this.homeService.postComment(this.book.id, comment).subscribe(
        (response: HttpResponse<Comment>) => {
          this.input.setValue('');
          this.comments.unshift(comment);
          console.log('posted comment: ', response.body) ;
          },
      (error) => {console.log('post comment error: ', error) ; }
      );
    }

  }

}
