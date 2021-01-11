export interface BookChartModalData {
  bookmarks: Bookmarks;
  userPicture: string;
  language: number;
}

export interface Bookmarks {
  bookmark: {
    headerTitle: Bookmark[],
  };
}

export interface Bookmark {
  title: string;
  page: number;
}
