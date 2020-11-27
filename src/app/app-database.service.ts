import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { Country, NewsArticle } from './model';

@Injectable({
  providedIn: 'root',
})
export class AppDatabaseService extends Dexie {
  private apiKey: Dexie.Table<string, number>;
  private countryList: Dexie.Table<Country, number>;
  private news: Dexie.Table<NewsArticle, number>;

  constructor() {
    super('appdb');
    this.version(1).stores({
      apiKey: 'key',
      countryList: '++countryId,countryName',
      news: '++id',
    });

    this.apiKey = this.table('apiKey');
    this.countryList = this.table('countryList');
    this.news = this.table('news');
  }
}
