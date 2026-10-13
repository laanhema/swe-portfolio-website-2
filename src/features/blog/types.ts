export interface BlogPost {
  slug: string;
  title: string;
  titleHighlight: string;
  summary: string;
  author: string;
  date: string;
  readingTime: string;
  tags: readonly string[];
  accentColor: string;
  content: string;
}
