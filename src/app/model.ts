export interface Country {
  countryId: string;
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

export interface ApiKey {
  key: string;
}

export interface ArticlesByCountry {
  countryCode: string;
  cachedTimestamp: number;
  articles: NewsArticle[];
}
