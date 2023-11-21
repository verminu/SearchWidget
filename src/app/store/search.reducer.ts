import {FacetConfig, FilterModel, ResultsColumn} from "../shared/search-widget/search-widget.model";
import {FormOptions} from "../shared/search-widget/form.service";
import {createReducer, on} from "@ngrx/store";
import {mainPageActions, routeActions, searchPageActions} from "./search.actions";

export interface SearchStateInterface {
  searchParams: {
    config: FacetConfig[],
    options?: FormOptions,
    columns: ResultsColumn[],
  },
  results: any[] | null,
  filters: FilterModel,
  searchInProgress: boolean,
  error: any,
  page: string,
}

const initialState: SearchStateInterface = {
  searchParams: {
    config: [],
    options: {},
    columns: [],
  },
  results: null,
  filters: null,
  searchInProgress: false,
  error: null,
  page: ''
}

export const SearchReducer = createReducer(
  initialState,

  on(mainPageActions.setSearchParams, (state, action) => ({
    ...state,
    searchParams: {...action.searchParams},
  })),

  on(searchPageActions.searchInitiated, (state, action) => ({
    ...state,
    filters: {...action.filters},
    searchInProgress: true,
  })),

  on(searchPageActions.searchCompleted, (state) => ({
    ...state,
    searchInProgress: false,
  })),

  on(searchPageActions.searchFailure, (state, action) => ({
    ...state,
    error: action.error
  })),

  on(searchPageActions.searchSuccess, (state, action) => ({
    ...state,
    results: action.results,
    error: null
  })),

  on(routeActions.updateRouteToSearch, (state) => ({
    ...state,
    page: 'search'
  })),

  on(routeActions.updateRouteToResults, (state) => ({
    ...state,
    page: 'results'
  })),

)
