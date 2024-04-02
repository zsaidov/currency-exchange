import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConvertorService {

  constructor(private readonly http: HttpClient) {
  }

  getRates(base = 'RUB'): Observable<any> {
    const params = new HttpParams({
      fromObject: {
        apikey: environment.apiKey,
        symbols: 'RUB,USD,EUR,GBP',
        base
      }
    })
    return this.http.get(`${ environment.apiUrl }rates/latest`, {params});
  }

  convert(from: string, to: string, amount: number): Observable<any> {
    const params = new HttpParams({
      fromObject: {from, to, amount, apikey: environment.apiKey}
    })
    return this.http.get(`${ environment.apiUrl }convert/latest`, {params});
  }
}
