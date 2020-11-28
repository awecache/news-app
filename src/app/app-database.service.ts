import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import {
  ApiKey,
  ArticlesByCountry,
  Country,
  NewsArticle,
  SavedArticles,
} from './model';

@Injectable({
  providedIn: 'root',
})
export class AppDatabaseService extends Dexie {
  private apiKey: Dexie.Table<ApiKey, number>;
  private countryList: Dexie.Table<Country, string>;
  private news: Dexie.Table<ArticlesByCountry, string>;
  private savedNews: Dexie.Table<SavedArticles, string>;

  constructor() {
    super('appdb');
    this.version(1).stores({
      apiKey: 'key',
      countryList: 'countryId,countryName',
      news: 'countryCode',
      savedNews: 'countryCode',
    });

    this.apiKey = this.table('apiKey');
    this.countryList = this.table('countryList');
    this.news = this.table('news');
    this.savedNews = this.table('savedNews');
  }

  addKey(key: ApiKey): void {
    console.log(key);

    this.apiKey.add(key);
  }

  getKey(): Promise<ApiKey[]> {
    return this.apiKey.toArray();
  }

  async deleteKey() {
    const key = (await this.getKey())[0].key;
    console.log('key to del', key);
    if (key) {
      this.apiKey.where('key').equals(key).delete();
    }
  }

  getCountires() {
    return this.countryList.toArray();
  }

  getCountryByCode(countryCode: string): Promise<Country | undefined> {
    return this.countryList.get(countryCode);
    // where('countryCode').equals(countryCode).toArray();
  }

  saveCountry(country: Country) {
    this.countryList.add(country);
  }

  getArticlesByCountry(
    countryCode: string
  ): Promise<ArticlesByCountry | undefined> {
    return this.news.get(countryCode);
  }

  cacheArticlesByCountry(articlesByCountry: ArticlesByCountry): void {
    this.news.put(articlesByCountry);
  }

  deleteCachedArticles(countryCode: string) {
    this.news.where('countryCode').equals(countryCode).delete();
  }

  getSavedArticlesByCountry(
    countryCode: string
  ): Promise<SavedArticles | undefined> {
    return this.savedNews.get(countryCode);
  }

  saveArticleByCountry(countryCode: string, savedArticle: NewsArticle) {
    this.getSavedArticlesByCountry(countryCode).then((savedArticlesObj) => {
      if (!savedArticlesObj) {
        const savedArticles: SavedArticles = {
          countryCode: countryCode,
          articles: [savedArticle],
        };
        this.savedNews.add(savedArticles);
        return;
      }

      const isDuplicate = !!savedArticlesObj.articles.find(
        (art) =>
          art.title === savedArticle.title && art.url === savedArticle.url
      );
      if (!isDuplicate) {
        const updatedSaveArticlesObj = { ...savedArticlesObj };
        updatedSaveArticlesObj.articles.push(savedArticle);
        this.savedNews.put(updatedSaveArticlesObj);
      }
    });
  }
}
