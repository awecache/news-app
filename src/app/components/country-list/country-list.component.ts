import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppDatabaseService } from 'src/app/app-database.service';

@Component({
  selector: 'app-country-list',
  templateUrl: './country-list.component.html',
  styleUrls: ['./country-list.component.css'],
})
export class CountryListComponent implements OnInit {
  apiKey?: string;

  constructor(private appDB: AppDatabaseService, private router: Router) {}

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
  }
}
