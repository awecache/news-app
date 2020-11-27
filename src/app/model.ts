export interface Country {
  countryId: number;
  countryName: string;
  flagUrl: string;
}

export interface NewsArticle {
  sourceName: string;
  author: string;
  title: string;
  description: string;
  url: string;
  imageUrl: string;
  publishDateTime: string;
  content: string;
}
