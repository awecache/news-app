import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ApisService {
  constructor(private http: HttpClient) {}

  async fetchCountries(): Promise<any[]> {
    const countryCodes = 'ae ar at au be bg br ca ch cn co cu cz de eg fr gb gr hk hu id ie il in it jp kr lt lv ma mx my ng nl no nz ph pl pt ro rs ru sa se sg si sk th tr tw ua us ve za'
      .split(' ')
      .join(';');

    const baseEndpoint = 'https://restcountries.eu/rest/v2/alpha';
    const params = new HttpParams().set('codes', countryCodes);

    return this.http
      .get<any[]>(baseEndpoint, { params })
      .toPromise();
  }
}
