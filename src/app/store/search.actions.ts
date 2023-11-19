import {createActionGroup, emptyProps, props} from "@ngrx/store";
import {FacetsConfig, FilterModel} from "../shared/search-widget/search-widget.model";
import {FormOptions} from "../shared/search-widget/form.service";

export const searchPageActions = createActionGroup({
  source: 'Search Page',
  events: {
    'Search Initiated': props<{filters: FilterModel}>(),
    'Search Success': props<{results: any[]}>(),
    'Search Failure': props<{error: any}>(),
    'Search Completed': emptyProps()
  }
})

export const mainPageActions = createActionGroup({
  source: 'Main Page',
  events: {
    'Set Widget Config': props<{
      config: FacetsConfig,
      options?: FormOptions
    }>(),

  }
})


