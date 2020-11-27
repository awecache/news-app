import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { SettingsComponent } from './components/settings/settings.component';
import { NewsComponent } from './components/news/news.component';
import { CountryListComponent } from './components/country-list/country-list.component';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

const routes: Routes = [
  { path: 'settings', component: SettingsComponent },
  { path: 'countries', component: CountryListComponent },
  { path: 'news/:countryCode', component: NewsComponent },
  { path: '**', redirectTo: 'countries', pathMatch: 'full' },
];
@NgModule({
  declarations: [
    AppComponent,
    SettingsComponent,
    NewsComponent,
    CountryListComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
