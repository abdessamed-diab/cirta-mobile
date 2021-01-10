import {UserProfile} from './UserProfile';
import {Book} from './Book';

export interface Comment {
  userProfile: UserProfile;
  book: Book;
  pageNumber: number;
  content: string;
  publishedAt: string;
  replies: Comment[];
  badge: string;
}

// badge-primary
// badge-secondary
// badge-success
// badge-danger
// badge-warning
// badge-info
// badge-light
// badge-dark
