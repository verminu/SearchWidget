import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {FacetsConfig, FilterModel, ResultsColumn} from "../shared/search-widget/search-widget.model";
import {FormOptions} from "../shared/search-widget/form.service";

export const searchPageActions = createActionGroup({
  source: 'Search Page',
  events: {
    'Search Initiated': props<{ filters: FilterModel }>(),
    'Search Success': props<{ results: any[] }>(),
    'Search Failure': props<{ error: any }>(),
    'Search Completed': emptyProps()
  }
})

export const mainPageActions = createActionGroup({
  source: 'Main Page',
  events: {
    'Set Search Params': props<{
      searchParams: {
        config: FacetsConfig,
        options?: FormOptions,
        columns: ResultsColumn[]
      }
    }>(),
  }
})

export const routeActions = createActionGroup({
  source: 'Route',
  events: {
    'Navigate To Search Page': emptyProps(),
    'Navigate To Results Page': emptyProps(),
    'Update Route To Search': emptyProps(),
    'Update Route To Results': emptyProps(),
  }
});


