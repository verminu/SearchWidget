import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {FilterModel} from "./shared/search-widget/search-widget.model";
import {delay, Observable, of, tap, throwError, timer} from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor() { }

  search(criteria: FilterModel): Observable<any> {
    return of(criteria).pipe(
      delay(1000),

    );

    // return timer(1000).pipe(
    //   tap(() => {
    //     throw new Error("an unexpected error occurred");
    //   })
    // )
  }
}
