import {Actions, createEffect, ofType} from "@ngrx/effects";
import {inject} from "@angular/core";
import {resultsPageActions, routeActions, searchPageActions} from "./search.actions";
import {catchError, EMPTY, map, of, switchMap, tap, withLatestFrom} from "rxjs";
import {Router} from "@angular/router";
import {SearchService} from "../search.service";
import {Store} from "@ngrx/store";
import {MatSnackBar} from "@angular/material/snack-bar";
import {searchFiltersSelector, searchResultsSelector} from "./search.feature";

/**
 * This effect handles the initiation of a search operation.
 * It listens for the `searchInitiated` action, calls the search service,
 * and then dispatches either a success or failure action based on the service response.
 */
export const search = createEffect((
  actions$ = inject(Actions),
  searchService = inject(SearchService)
) => {
  return actions$.pipe(
    ofType(searchPageActions.searchInitiated),
    switchMap(action => {
      // Call the search service with the provided filters
      return searchService.search(action.filters).pipe(
        // On success, dispatch the `searchSuccess` action with the results
        map(results => searchPageActions.searchSuccess({results})),
        // On failure, dispatch the `searchFailure` action with the error
        catchError(error => of(searchPageActions.searchFailure({error}))),
      )
    })
  )
}, {
  functional: true,
  dispatch: true
})

/**
 * Navigate to the results page upon successful search.
 */
export const searchSuccess = createEffect((
  actions$ = inject(Actions),
) => {
  return actions$.pipe(
    ofType(searchPageActions.searchSuccess),
    // Trigger navigation to the results page
    map(() => routeActions.navigateToResultsPage()),
  )
}, {
  functional: true,
  dispatch: true
})

/**
 * Mark the search as completed after success or failure.
 */
export const searchCompleted = createEffect((
  actions$ = inject(Actions)
) => {
  return actions$.pipe(
    ofType(
      searchPageActions.searchSuccess,
      searchPageActions.searchFailure),
    // Dispatch the `searchCompleted` action
    map(() => searchPageActions.searchCompleted())
  )
}, {
  functional: true,
  dispatch: true
})

/**
 * Effect for navigation to the search page.
 * It listens for the `navigateToSearchPage` action and triggers a router navigation.
 */
export const navigateToSearchPage = createEffect((
  actions$ = inject(Actions),
  router = inject(Router),
  store = inject(Store)
) => {
  return actions$.pipe(
    ofType(routeActions.navigateToSearchPage),
    tap(() => {
      // Navigate to the search page and then update the route state
      router.navigate(['search']).then(() => {
        store.dispatch(routeActions.updateRouteToSearch());
      })
    })
  )
}, {
  functional: true,
  dispatch: false
})

/**
 * Effect for navigation to the results page.
 * It listens for the `navigateToResultsPage` action and triggers a router navigation.
 */
export const navigateToResultsPage = createEffect((
  actions$ = inject(Actions),
  router = inject(Router),
  store = inject(Store)
) => {
  return actions$.pipe(
    ofType(routeActions.navigateToResultsPage),
    tap(() => {
      // Navigate to the results page and then update the route state
      router.navigate(['results']).then(() => {
        store.dispatch(routeActions.updateRouteToResults());
      })
    })
  )
}, {
  functional: true,
  dispatch: false
})

/**
 * Display an error message using a snack bar when a search fails.
 */
export const searchError = createEffect((
  actions$ = inject(Actions),
  snackBar = inject(MatSnackBar)
) => {
  return actions$.pipe(
    ofType(searchPageActions.searchFailure),
    tap((action) => {
      // Open a snack bar with the error message
      snackBar.open(action.error?.message || 'An unexpected error has occurred.', 'Close', {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'top',
      });
    })
  )
}, {
  functional: true,
  dispatch: false
})

/**
 * Initiate a search if the results page is loaded without any results.
 */
export const loadResultsIfNone = createEffect((
  actions$ = inject(Actions),
  store = inject(Store),
) => {
  return actions$.pipe(
    ofType(resultsPageActions.pageLoaded),
    // Select the latest state values of search results and search filters
    withLatestFrom(
      store.select(searchResultsSelector),
      store.select(searchFiltersSelector)
    ),
    switchMap(([_, results, filters]) => {
      if (results === null) {
        // If there are no results, initiate a new search with the current filters
        return of(searchPageActions.searchInitiated({ filters }));
      }
      // Otherwise, do nothing
      return EMPTY;
    })
  )
}, {
  functional: true,
  dispatch: true
})
