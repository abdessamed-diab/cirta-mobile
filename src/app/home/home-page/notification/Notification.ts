import {Comment} from '../../models/Comment';

export interface Notification {
  id: number;
  parentComment: Comment;
  reply: Comment;
  checked: boolean;
}
