import {FacetsConfig, FilterModel, ResultsColumn} from "../shared/search-widget/search-widget.model";
import {FormOptions} from "../shared/search-widget/form.service";
import {createReducer, on} from "@ngrx/store";
import {mainPageActions, searchPageActions} from "./search.actions";
import {BookModel} from "../search.service";

export interface SearchStateInterface {
  searchParams: {
    config: FacetsConfig,
    options?: FormOptions,
    columns: ResultsColumn[],
  },
  results: any[],
  filters: FilterModel,
  searchInProgress: boolean,
  error: any
}

const initialState: SearchStateInterface = {
  searchParams: {
    config: [],
    options: {},
    columns: [],
  },
  results: [],
  filters: null,
  searchInProgress: false,
  error: null,
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
  }))
)
