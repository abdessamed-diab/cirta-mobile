import {Comment} from '../../models/Comment';

export interface CommentHelper {
  parent: Comment;
  source: EventSource;
}
