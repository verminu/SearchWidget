import {Actions, createEffect, ofType} from "@ngrx/effects";
import {inject} from "@angular/core";
import {routeActions, searchPageActions} from "./search.actions";
import {catchError, map, of, switchMap, tap} from "rxjs";
import {Router} from "@angular/router";
import {SearchService} from "../search.service";
import {Store} from "@ngrx/store";

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
        catchError(error => of(searchPageActions.searchFailure({error}))),
      )
    })
  )
}, {
  functional: true,
  dispatch: true
})

export const searchSuccess = createEffect((
  actions$ = inject(Actions),
) => {
  return actions$.pipe(
    ofType(searchPageActions.searchSuccess),
    map(() => routeActions.navigateToResultsPage()),
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

export const navigateToSearchPage = createEffect((
  actions$ = inject(Actions),
  router = inject(Router),
  store = inject(Store)
) => {
  return actions$.pipe(
    ofType(routeActions.navigateToSearchPage),
    tap(() => {
      router.navigate(['search']).then(() => {
        store.dispatch(routeActions.updateRouteToSearch());
      })
    })
  )
}, {
  functional: true,
  dispatch: false
})

export const navigateToResultsPage = createEffect((
  actions$ = inject(Actions),
  router = inject(Router),
  store = inject(Store)
) => {
  return actions$.pipe(
    ofType(routeActions.navigateToResultsPage),
    tap(() => {
      router.navigate(['results']).then(() => {
        store.dispatch(routeActions.updateRouteToResults());
      })
    })
  )
}, {
  functional: true,
  dispatch: false
})
