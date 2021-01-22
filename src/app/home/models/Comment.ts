import {UserProfile} from './UserProfile';

export interface Comment {
  id: number;
  userProfile: UserProfile;
  bookId: number;
  pageNumber: number;
  content: string;
  publishedAt: string;
  replies: Comment[];
  badge: string;

  tempId: number;
  persistedAt: string;
}

// badge-primary
// badge-secondary
// badge-success
// badge-danger
// badge-warning
// badge-info
// badge-light
// badge-dark
