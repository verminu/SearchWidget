import {FacetsConfig, FilterModel} from "../shared/search-widget/search-widget.model";
import {FormOptions} from "../shared/search-widget/form.service";
import {createReducer, on} from "@ngrx/store";
import {mainPageActions, searchPageActions} from "./search.actions";

export interface SearchStateInterface {
  widget: {
    config: FacetsConfig,
    options?: FormOptions
  },
  results: any[],
  filters: FilterModel,
  searchInProgress: boolean,
  error: any
}

const initialState: SearchStateInterface = {
  widget: {
    config: [],
    options: {}
  },
  results: [],
  filters: null,
  searchInProgress: false,
  error: null,
}

export const SearchReducer = createReducer(
  initialState,

  on(mainPageActions.setWidgetConfig, (state, action) => ({
    ...state,
    widget: {...action}
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
