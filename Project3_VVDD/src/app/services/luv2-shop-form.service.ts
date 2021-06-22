import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';

@Injectable({
  providedIn: 'root'
})
export class Luv2ShopFormService {
  private countriesUrl = "http://localhost:8080/api/countries";
  private statesUrl = "http://localhost:8080/api/states";
  constructor(private httpClient: HttpClient) { }
  getCreditCardMonths(startMonth: number): Observable<number[]> {
    const data: number[] = [];
    for (let theMonth = startMonth; theMonth <= 12; theMonth++) {
      data.push(theMonth);
    }
    return of(data);
  }
  getCreditCardYear(): Observable<number[]> {
    const data: number[] = [];
    const startYear: number = new Date().getFullYear();
    const endYear: number = startYear + 10;
    for (let theYear = startYear; theYear <= endYear; theYear++) {
      data.push(theYear);
    }
    return of(data);
  }
  getStates(theCountryCode: string): Observable<State[]> {
    const searchStateUrl = `${this.statesUrl}/search/${theCountryCode}`;
    console.log(this.httpClient.get<State[]>(searchStateUrl));
    return this.httpClient.get<State[]>(searchStateUrl);
  }
  getCountries(): Observable<Country[]> {
    const searchStateUrl = `${this.countriesUrl}`;
    console.log(this.httpClient.get<Country[]>(searchStateUrl));
    return this.httpClient.get<Country[]>(searchStateUrl);
  }
}
