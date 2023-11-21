/**
 * Define the interfaces for the facets configuration
 */
export enum FacetType {
  YesNo = 'yesno',
  Multiselect = 'multiselect',
  Checkboxes = 'checkboxes',
}

export type FacetConfig<DataModel = Record<string, any>> = {
  type: FacetType;
  label: string;
  key: keyof DataModel;
  data?: string[]
}

/**
 * Define the interfaces for the selections in the form
 */

// true = yes, false = no, null = irrelevant
export type YesNoSelection = true | false | null;

export type ListSelection = string[];

export type FacetSelection =
  YesNoSelection |
  ListSelection

export type FilterSelection = {
  [facetKey: string]: FacetSelection
}

// defines the type of the data emitted by the search event
export type FilterModel = {
  // search query
  searchTerm?: string;
  // selections for each facet
  selections?: FilterSelection
} | null

export type ResultsColumn = [key: string, label: string]
