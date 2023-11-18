/**
 * Define the interfaces for the facets configuration
 */
export enum FacetType {
  YesNo = 'yesno',
  Multiselect = 'multiselect',
  Checkboxes = 'checkboxes',
}

export type FacetConfig = {
  type: FacetType; // specify the type of the widget to be displayed
  label: string; // the label of the widget
  key: string; // each widget has a unique key, so it can be identified
  data?: Map<string|number, string> // additional data needed for displaying a facet
}

export type FacetsConfig = FacetConfig[]

/**
 * Define the interfaces for the selections in the form
 */

// true = yes, false = no, null = irrelevant
export type YesNoSelection = true | false | null;

export type ListSelection = [string|number, string][];

export type FacetSelection =
  YesNoSelection |
  ListSelection

// defines the type of the data emitted by the search event
export type FilterModel = {
  // search query
  searchTerm?: string;
  // selections for each facet
  selections?: {
    [facetKey: string]: FacetSelection
  }
}
