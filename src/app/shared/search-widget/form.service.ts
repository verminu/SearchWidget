import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, AbstractControl, FormArray, FormControl} from '@angular/forms';
import {
  FacetConfig,
  FacetType,
  FilterModel, FilterSelection,
  ListSelection,
  YesNoSelection
} from './search-widget.model';

interface FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl;

  validateFacetConfig(facet: FacetConfig): true | string;

  processData(facet: FacetConfig): void;

  patchFormSelections(formControl: AbstractControl, selections: any, facet: FacetConfig): void;
}

export type FormOptions = {
  minSearchLength?: number,
  maxSearchLength?: number
}

@Injectable({
  providedIn: 'root'
})
export class FormService {
  private readonly MAX_SEARCH_LENGTH_LIMIT = 50;
  private readonly MIN_SEARCH_LENGTH = 3;
  private readonly MAX_SEARCH_LENGTH = 20;

  private facetHandlerRegistry: Map<FacetType, FacetHandler> = new Map();
  private facetKeys: Set<string> = new Set();
  private facetConfig: FacetConfig[] = [];
  private options: FormOptions = {};

  constructor(private formBuilder: FormBuilder) {
    this.registerFacetHandlers();
  }

  /**
   * Create the search form with facets and options
   */
  createSearchForm(facets: FacetConfig[], options: FormOptions): FormGroup {
    // Validate and set search length defaults
    const {minSearchLength, maxSearchLength} = this.validateAndSetSearchLengths(options);

    let form = this.formBuilder.group({
      searchTerm: ['', {
        validators: this.searchValidator(minSearchLength, maxSearchLength),
        updateOn: 'submit'
      }],
      selections: this.formBuilder.group({})
    });

    this.addFacetControls(form, facets);

    this.options = {minSearchLength, maxSearchLength};

    return form;
  }

  getFacetConfig(): FacetConfig[] {
    return [...this.facetConfig];
  }

  getOptions(): FormOptions {
    return {...this.options};
  }

  resetForm(form: FormGroup, facets: FacetConfig[]) {
    form.reset({
      searchTerm: '',
      selections: this.buildInitialSelections(facets)
    });
  }

  updateFilters(form: FormGroup, filters: FilterModel | null, facets: FacetConfig[]) {
    if (form && filters) {
      this.resetForm(form, facets);
      this.patchForm(form, filters, facets);
    }
  }

  private buildInitialSelections(facets: FacetConfig[]): Record<string, any> {
    const selectionsGroup: Record<string, any> = {};

    facets.forEach(facet => {
      if (facet.type === FacetType.Checkboxes && facet.data) {
        selectionsGroup[facet.key] = Array.from(facet.data.keys()).map(() => false);
      } else {
        selectionsGroup[facet.key] = null;
      }
    });

    return selectionsGroup;
  }

  private patchForm(form: FormGroup, filters: FilterModel, facets: FacetConfig[]) {
    if (form && filters) {
      form.patchValue({
        searchTerm: filters?.searchTerm,
      });

      this.patchFormSelections(form, filters.selections, facets);
    }
  }

  private registerFacetHandlers() {
    this.facetHandlerRegistry.set(FacetType.Checkboxes, new CheckboxFacetHandler());
    this.facetHandlerRegistry.set(FacetType.Multiselect, new MultiselectFacetHandler());
    this.facetHandlerRegistry.set(FacetType.YesNo, new YesNoFacetHandler());
  }

  private validateAndSetSearchLengths(options: { minSearchLength?: number, maxSearchLength?: number }): {
    minSearchLength: number,
    maxSearchLength: number
  } {
    let minSearchLength = options.minSearchLength ?? this.MIN_SEARCH_LENGTH;
    let maxSearchLength = options.maxSearchLength ?? this.MAX_SEARCH_LENGTH;

    minSearchLength = this.ensureWithinRange(minSearchLength, 0, this.MAX_SEARCH_LENGTH_LIMIT, this.MIN_SEARCH_LENGTH);
    maxSearchLength = this.ensureWithinRange(maxSearchLength, 0, this.MAX_SEARCH_LENGTH_LIMIT, this.MAX_SEARCH_LENGTH);

    if (maxSearchLength < minSearchLength) {
      console.warn(`Max search length is less than min search length. Adjusting to default values.`);

      minSearchLength = this.MIN_SEARCH_LENGTH;
      maxSearchLength = this.MAX_SEARCH_LENGTH;
    }

    return {minSearchLength, maxSearchLength};
  }

  private ensureWithinRange(value: number, min: number, max: number, defaultValue: number): number {
    return (value >= min && value <= max) ? value : defaultValue;
  }

  private addFacetControls(form: FormGroup, facets: FacetConfig[]): void {
    facets.forEach(f => {
      const facet = {...f};

      if (!this.isFacetKeyUnique(facet.key)) {
        console.error(`Duplicate facet key ${facet.key}`);
        return;
      }

      const handler = this.facetHandlerRegistry.get(facet.type);
      if (!handler) {
        console.error(`Handler not found for facet type: ${facet.type}`);
        return;
      }

      const facetConfigValidation = handler.validateFacetConfig(facet);
      if (facetConfigValidation !== true) {
        console.error(facetConfigValidation);
        return;
      }

      handler.processData(facet);

      const control = handler.createControl(facet, this.formBuilder);
      (form.get('selections') as FormGroup).addControl(facet.key, control);

      this.facetConfig.push(facet);
      this.facetKeys.add(facet.key.toLowerCase());
    });
  }

  private isFacetKeyUnique(facetKey: string): boolean {
    return !this.facetKeys.has(facetKey.toLowerCase());
  }

  private searchValidator(minLength: number, maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const input = control.value?.trim();
      const isValid = !input || (input.length >= minLength && input.length <= maxLength);
      return isValid ? null : {'searchInvalid': true};
    };
  }

  private patchFormSelections(form: FormGroup, selections: FilterSelection | undefined | null, facets: FacetConfig[]) {
    if (!selections) {
      return;
    }

    const selectionsGroup = form.get('selections') as FormGroup;

    for (const facetKey of Object.keys(selections)) {
      const facet = facets.find((f) => f.key === facetKey);
      if (!facet) {
        console.error(`Facet config not found for key: ${facetKey}`);
        continue;
      }

      const handler = this.facetHandlerRegistry.get(facet.type);
      if (!handler) {
        console.error(`Handler not found for facet type: ${facet.type}`);
        continue;
      }

      const formControl = selectionsGroup.get(facetKey);
      if (!formControl) {
        console.error(`Form control not found for facet key: ${facetKey}`);
        continue;
      }

      handler.patchFormSelections(formControl, selections[facetKey], facet);
    }
  }
}

class CheckboxFacetHandler implements FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl {
    return formBuilder.array(
      facet.data!.map(() => formBuilder.control(false))
    );
  }

  validateFacetConfig(facet: FacetConfig): true | string {
    if (!Array.isArray(facet.data) || !facet.data.length) {
      return `Checkbox facet '${facet.key}' requires a non-empty array 'data' property`;
    }

    return true;
  }

  processData(facet: FacetConfig) {
    facet.data = [...facet.data!].sort();
  }

  patchFormSelections(formControl: FormArray, selections: ListSelection, facet: FacetConfig) {
    if (!selections || !facet.data) {
      return
    }

    const controlValue = formControl.value as boolean[];

    selections.forEach(selection => {
      const selectionIndex = facet.data!.indexOf(selection);
      if (selectionIndex >= 0) {
        controlValue[selectionIndex] = true;
      }
    })

    formControl.patchValue(controlValue);
  }
}

class MultiselectFacetHandler implements FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl {
    return formBuilder.control(null);
  }

  validateFacetConfig(facet: FacetConfig): true | string {
    if (!Array.isArray(facet.data) || !facet.data.length) {
      return `Multiselect facet '${facet.key}' requires a non-empty array 'data' property`;
    }

    return true;
  }

  processData(facet: FacetConfig) {
    facet.data = [...facet.data!].sort();
  }

  patchFormSelections(formControl: FormGroup, selections: ListSelection, facet: FacetConfig) {
    formControl.setValue(selections);
  }
}

class YesNoFacetHandler implements FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl {
    return formBuilder.control(null);
  }

  validateFacetConfig(facet: FacetConfig): true | string {
    return true;
  }

  processData(facet: FacetConfig) {

  }

  patchFormSelections(formControl: FormControl, selections: YesNoSelection, facet: FacetConfig) {
    formControl.setValue(selections);
  }
}
