import {Actions, createEffect, ofType} from "@ngrx/effects";
import {inject} from "@angular/core";
import {searchPageActions} from "./search.actions";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {Router} from "@angular/router";
import {SearchService} from "../search.service";

export const search = createEffect((
  actions$ = inject(Actions),
  router = inject(Router),
  searchService = inject(SearchService)
) => {
  return actions$.pipe(
    ofType(searchPageActions.searchInitiated),
    switchMap(action => {
      return searchService.search(action.filters).pipe(
        map(results => searchPageActions.searchSuccess({results})),
        tap(() => {
          router.navigateByUrl('/results')
        }),
        catchError(error => of(searchPageActions.searchFailure({error}))),
      )
    })
  )
}, {
  functional: true,
  dispatch: true
})

export const searchCompleted = createEffect((
  actions$ = inject(Actions)
) => {
  return actions$.pipe(
    ofType(searchPageActions.searchSuccess, searchPageActions.searchFailure),
    map(() => searchPageActions.searchCompleted())
  )
}, {
  functional: true,
  dispatch: true
})
