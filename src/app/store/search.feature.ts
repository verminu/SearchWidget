import {createFeature, createSelector} from "@ngrx/store";
import {SearchReducer} from "./search.reducer";

export const {
  name: searchFeatureKey,
  reducer: searchReducer,
  selectWidget: searchWidgetConfigSelector,
  selectResults: searchResultsSelector,
  selectColumns: searchResultsColumns,
  selectError: searchErrorSelector,
  selectSearchInProgress: searchInProgressSelector
} = createFeature({
  name: 'search',
  reducer: SearchReducer,
  extraSelectors: ({selectSearchParams}) => ({
    selectWidget: createSelector(
      selectSearchParams,
      (searchParams) => ({
        config: searchParams.config,
        options: searchParams.options
      })
    ),
    selectColumns: createSelector(
      selectSearchParams,
      (searchParams) => new Map(searchParams.columns)
    )
  })
})
