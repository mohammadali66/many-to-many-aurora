import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
// import 'rxjs/Rx';
// import 'rxjs/add/operator/toPromise';
// import 'rxjs/add/operator/catch'
// import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ManyToManyAuroraService {

  constructor(private httpClient: HttpClient) { }

  //............................................................................
  // get api
  // should be used '/' sign first and end of url
  // should be used '?format=json' in url
  getApi(url, jwtToken) {

    let headers = new HttpHeaders();
    if (jwtToken !== '') {
      headers = new HttpHeaders({ 'Authorization': 'JWT ' + jwtToken });
    } else {
      headers = new HttpHeaders();
    }
    let options = {
      headers: headers
    };

    return this.httpClient.get(url, options).pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
    );
  }

  //............................................................................
  // get api without auth
  // should be used '/' sign first and end of url
  // should be used '?format=json' in url
  getApiWithoutAuth(url) {

    let options = {};

    return this.httpClient.get(url, options).pipe(
        catchError((errorResponse: HttpErrorResponse) => {
          return throwError(errorResponse.error);
        })
    );
  }
}
