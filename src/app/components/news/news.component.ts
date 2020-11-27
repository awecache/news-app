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

    // this.countryName = this.ap;
    this.appDB.getCountryByCode(this.countryCode).then((res) => {
      this.countryName = res?.countryName ?? '';
    });

    this.appDB
      .getNewsByCountryCode(this.countryCode)
      .then((articlesByCountry) => {
        if (!this.countryCode) {
          this.router.navigate(['/countries']);
          return;
        }

        const millis = Date.now() - (articlesByCountry?.cachedTimestamp || 0);
        const minLapsed = Math.floor(millis / 1000) / 60;

        const isCacheExpired = minLapsed > 5;
        if (!articlesByCountry || isCacheExpired) {
          if (articlesByCountry) {
            this.appDB.deleteCachedArticles(this.countryCode);
          }

          this.apis
            .fetchArticles(this.countryCode)
            .then((res) => {
              const articles: NewsArticle[] = res.articles.map(
                (article: any) => {
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
                }
              );

              const articlesByCountry = {
                articles,
                countryCode: this.countryCode || '',
                cachedTimestamp: Date.now(),
              };

              this.appDB.cacheArticlesByCountry(articlesByCountry);
            })
            .then(() => {
              if (this.countryCode) {
                this.appDB
                  .getNewsByCountryCode(this.countryCode)
                  .then((res) => {
                    console.log(res);
                  });
              }
            });
        }
        this.appDB.getNewsByCountryCode(this.countryCode).then((res) => {
          this.articles = res?.articles;
        });
      });
    console.log('arti', this.articles);

    // this.appDB
    //   .getSavedArticlesByCountry(this.countryCode)
    //   .then((articlesByCountry) => {
    //     if (articlesByCountry?.articles.length) {
    //       this.articles = [...this.articles, ...articlesByCountry.articles];
    //     }
    //   });
  }
}
