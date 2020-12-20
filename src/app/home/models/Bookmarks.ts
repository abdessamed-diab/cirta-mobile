export interface Bookmarks {
  bookmark: {
    headerTitle: Bookmark[],
  };
}

export interface Bookmark {
  title: string;
  page: number;
}
