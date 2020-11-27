import { Injectable } from '@angular/core';
import Dexie from 'dexie';
import { ApiKey, Country, NewsArticle } from './model';

@Injectable({
  providedIn: 'root',
})
export class AppDatabaseService extends Dexie {
  private apiKey: Dexie.Table<ApiKey, number>;
  // private countryList: Dexie.Table<Country, number>;
  // private news: Dexie.Table<NewsArticle, number>;

  constructor() {
    super('appdb');
    this.version(1).stores({
      apiKey: 'key',
      // countryList: '++countryId,countryName',
      // news: '++id',
    });

    this.apiKey = this.table('apiKey');
    // this.countryList = this.table('countryList');
    // this.news = this.table('news');
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
}
