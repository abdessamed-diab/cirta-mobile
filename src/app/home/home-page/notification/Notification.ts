import {Comment} from '../../models/Comment';
import {Book} from '../../models/Book';

export interface Notification {
  id: number;
  reply: Comment;
  book: Book;
  checked: boolean;
  type: string;
}
