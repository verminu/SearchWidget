/**
 * Define the interfaces for the facets configuration
 */

type BaseFacetConfig = {
  type: string; // specify the type of the widget to be displayed
  label: string; // the label of the widget
  key: string // each widget has a unique key, so it can be identified
}

type YesNoFacetConfig = BaseFacetConfig & {
  type: 'yesNo';
}

type MultiselectFacetConfig = BaseFacetConfig & {
  type: 'multiselect';
  data: {
    key: string | number;
    label: string;
  }[]
}

type CheckboxesFacetConfig = BaseFacetConfig & {
  type: 'checkboxes';
  data: {
    key: string | number;
    label: string;
  }[]
}

// used to describe the data type of the search form's facets configuration
export type FacetConfig =
  YesNoFacetConfig |
  MultiselectFacetConfig |
  CheckboxesFacetConfig

export type FacetsConfig = FacetConfig[]

/**
 * Define the interfaces for the selections in the form
 */

// true = yes, false = no, null = irrelevant
type YesNoSelection = boolean | null;

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
