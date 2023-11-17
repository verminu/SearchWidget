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
  data?: { // additional data needed for displaying a facet
    key: string | number;
    label: string;
  }[]
}

export type FacetsConfig = FacetConfig[]

/**
 * Define the interfaces for the selections in the form
 */

// true = yes, false = no, null = irrelevant
type YesNoSelection = true | false | null;

type MultiselectSelection = {
  key: string | number;
  label?: string;
}[]

type CheckboxesSelection = {
  key: string | number;
  label?: string;
}[]

type FacetSelection =
  YesNoSelection |
  MultiselectSelection |
  CheckboxesSelection

// defines the type of the data emitted by the search event
export type FilterModel = {
  // search query
  searchTerm: string;
  // selections for each facet
  selections: {
    [facetKey: string]: FacetSelection
  }
}
