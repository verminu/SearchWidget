import { Injectable } from '@angular/core';
import {FacetConfig, FacetSelection, FacetType, FilterModel, ListSelection, YesNoSelection} from "./search-widget.model";

interface FacetMappingStrategy {
  mapValue(facetValue: any, facetConfig: FacetConfig): FacetSelection | undefined;
}

@Injectable()
export class DataMappingService {
  private facetMappingStrategies: Map<FacetType, FacetMappingStrategy>;

  constructor() {
    this.facetMappingStrategies = new Map<FacetType, FacetMappingStrategy>([
      [FacetType.Checkboxes, new CheckboxMappingStrategy()],
      [FacetType.Multiselect, new MultiselectMappingStrategy()],
      [FacetType.YesNo, new YesNoMappingStrategy()],
    ]);
  }

  mapRawValues(formValue: any, facets: FacetConfig[]): FilterModel {
    const filters: FilterModel = {};

    const searchTerm = this.sanitizeSearchTerm(formValue.searchTerm);
    const selections = this.mapFacetSelections(formValue.selections, facets);

    searchTerm !== undefined && (filters.searchTerm = searchTerm);
    selections !== undefined && (filters.selections = selections);

    return filters;
  }

  private sanitizeSearchTerm(input: string): string | undefined {
    const trimmedInput = input?.trim();
    return trimmedInput ? trimmedInput : undefined;
  }

  private mapFacetSelections(selectionsRawValue: any, facets: FacetConfig[]): { [key: string]: any } | undefined {
    let sanitizedSelection: { [key: string]: any } | undefined = undefined;

    for (const facetKey of Object.keys(selectionsRawValue)) {
      const facetSelection = this.mapSingleFacetSelection(facetKey, selectionsRawValue[facetKey], facets);
      if (facetSelection !== undefined && facetSelection !== null) {
        sanitizedSelection = sanitizedSelection || {};
        sanitizedSelection[facetKey] = facetSelection;
      }
    }

    return sanitizedSelection;
  }

  private mapSingleFacetSelection(facetKey: string, facetValue: any, facets: FacetConfig[]): FacetSelection | undefined {
    const facetConfig = facets.find(facet => facet.key === facetKey);
    if (!facetConfig) {
      console.error(`Facet config not found for key: ${facetKey}`);
      return undefined;
    }

    const mappingStrategy = this.facetMappingStrategies.get(facetConfig.type);
    if (!mappingStrategy) {
      console.error(`No mapping strategy found for facet type: ${facetConfig.type}`);
      return undefined;
    }

    return mappingStrategy.mapValue(facetValue, facetConfig);
  }
}

class CheckboxMappingStrategy implements FacetMappingStrategy {
  mapValue(checkboxValues: boolean[], facetConfig: FacetConfig): ListSelection | undefined {
    if (!facetConfig.data) return undefined;

    const selections = checkboxValues
      .map((checked, index) => checked ? facetConfig.data![index] : null)
      .filter(value => value !== null);

    return selections.length ? (selections as ListSelection) : undefined;
  }
}

class MultiselectMappingStrategy implements FacetMappingStrategy {
  mapValue(multiselectValues: ListSelection | null): ListSelection | undefined {
    return multiselectValues?.length ? multiselectValues : undefined;
  }
}

class YesNoMappingStrategy implements FacetMappingStrategy {
  mapValue(value: YesNoSelection, facetConfig: FacetConfig): FacetSelection | undefined {
    return value;
  }
}
