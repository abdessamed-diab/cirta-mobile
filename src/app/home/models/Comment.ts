import {UserProfile} from './UserProfile';
import {Book} from './Book';

export interface Comment {
  id: number;
  userProfile: UserProfile;
  book: Book;
  pageNumber: number;
  content: string;
  publishedAt: string;
  replies: Comment[];
  badge: string;

  temp: boolean;
}

// badge-primary
// badge-secondary
// badge-success
// badge-danger
// badge-warning
// badge-info
// badge-light
// badge-dark
