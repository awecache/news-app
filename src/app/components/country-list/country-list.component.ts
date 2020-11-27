import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApisService } from 'src/app/apis.service';
import { AppDatabaseService } from 'src/app/app-database.service';
import { Country } from 'src/app/model';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css'],
})
export class CountryListComponent implements OnInit {
  apiKey?: string;
  countries?: Country[];

  constructor(
    private appDB: AppDatabaseService,
    private router: Router,
    private apis: ApisService
  ) {}

  ngOnInit(): void {
    this.appDB
      .getKey()
      .then((key) => {
        this.apiKey = key[0]?.key;
      })
      .then(() => {
        if (!this.apiKey) {
          this.router.navigate(['/settings']);
        }
      });

    this.appDB
      .getCountires()
      .then((countries) => {
        this.countries = countries;
      })
      .then(() => {
        if (!this.countries?.length) {
          this.apis.fetchCountries().then((countries) =>
            countries.map((country) => {
              const formattedCountry: Country = {
                countryName: country.name,
                flagUrl: country.flag,
              };

              this.appDB.saveCountry(formattedCountry);
            })
          );
        }
      });

    //
  }
}
