import {createFeature} from "@ngrx/store";
import {SearchReducer} from "./search.reducer";

export const {
  name: searchFeatureKey,
  reducer: searchReducer,
  selectWidget: searchWidgetConfigSelector,
  selectResults: searchResultsSelector,
  selectError: searchErrorSelector,
  selectSearchInProgress: searchInProgressSelector
} = createFeature({
  name: 'search',
  reducer: SearchReducer,
})
