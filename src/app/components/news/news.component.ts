import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApisService } from 'src/app/apis.service';
import { AppDatabaseService } from 'src/app/app-database.service';
import { ArticlesByCountry, NewsArticle } from 'src/app/model';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
})
export class NewsComponent implements OnInit {
  countryCode?: string;
  articles: NewsArticle[] = [];
  countryName?: string;

  constructor(
    private appDB: AppDatabaseService,
    private apis: ApisService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      this.countryCode = param.countryCode;
    });

    if (!this.countryCode) {
      this.router.navigate(['/countries']);
      return;
    }

    this.appDB.getKey().then((keys) => {
      if (!keys.length) {
        this.router.navigate(['/settings']);
        return;
      }
    });

    this.appDB.getCountryByCode(this.countryCode).then((res) => {
      this.countryName = res?.countryName ?? '';
    });

    this.appDB
      .getArticlesByCountry(this.countryCode)
      .then((articlesByCountry) => {
        if (!articlesByCountry) {
          return this.apis
            .fetchArticles(this.countryCode!)
            .then(({ articles }) => {
              const newsArticles = articles.map((article: any) => {
                const {
                  source,
                  author,
                  title,
                  description,
                  url,
                  urlToImage,
                  publishedAt,
                  content,
                } = article;

                return {
                  author,
                  title,
                  description,
                  content,
                  url,
                  sourceName: source.name as string,
                  imageUrl: urlToImage,
                  publishDateTime: publishedAt,
                };
              });

              this.cacheArticles(newsArticles, this.countryCode!);

              return newsArticles;
            });
        }

        const millis = Date.now() - (articlesByCountry?.cachedTimestamp || 0);
        const minLapsed = Math.floor(millis / 1000) / 60;
        const minBefExpir = 5;
        const isCacheExpired = minLapsed > minBefExpir;

        if (isCacheExpired) {
          this.appDB.deleteCachedArticles(this.countryCode!);
          return this.apis
            .fetchArticles(this.countryCode!)
            .then(({ articles }) => {
              const newsArticles = articles.map((article: any) => {
                const {
                  source,
                  author,
                  title,
                  description,
                  url,
                  urlToImage,
                  publishedAt,
                  content,
                } = article;

                return {
                  author,
                  title,
                  description,
                  content,
                  url,
                  sourceName: source.name as string,
                  imageUrl: urlToImage,
                  publishDateTime: publishedAt,
                };
              });

              this.cacheArticles(newsArticles, this.countryCode!);

              return newsArticles;
            });
        }

        return articlesByCountry.articles;
      })
      .then((newsArticles: NewsArticle[]) => {
        let mergedArticles: NewsArticle[] = [];
        return this.appDB
          .getSavedArticlesByCountry(this.countryCode!)
          .then((savedArticles) => {
            if (savedArticles) {
              mergedArticles = [...savedArticles.articles];

              newsArticles.forEach((article: NewsArticle) => {
                const isDuplicate = !!savedArticles.articles.find((el) => {
                  return el.title === article.title && el.url === article.url;
                });
                if (!isDuplicate) {
                  mergedArticles.push(article);
                }
              });
            } else {
              mergedArticles = [...newsArticles];
            }
            return mergedArticles;
          });
      })
      .then((mergedArticles) => {
        this.articles = mergedArticles;
      });
  }

  cacheArticles = (articles: NewsArticle[], countryCode: string) => {
    const articlesByCountry = {
      articles,
      countryCode,
      cachedTimestamp: Date.now(),
    };

    this.appDB.cacheArticlesByCountry(articlesByCountry);
  };

  saveArticle(article: NewsArticle) {
    const countryCode = this.countryCode;
    if (!countryCode) {
      console.log('missing country code');
      return;
    }
    this.appDB.saveArticleByCountry(countryCode, article);
  }
}
