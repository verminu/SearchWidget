import {Injectable} from '@angular/core';
import {FormBuilder, FormGroup, ValidatorFn, AbstractControl} from '@angular/forms';
import {FacetConfig, FacetType} from './search-widget.model';

interface FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl;

  validateFacetConfig(facet: FacetConfig): true | string;
}

export type FormOptions = {
  minSearchLength?: number,
  maxSearchLength?: number
}

@Injectable()
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
    facets.forEach(facet => {
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
      const input = control.value.trim();
      const isValid = input === '' || (input.length >= minLength && input.length <= maxLength);
      return isValid ? null : {'searchInvalid': true};
    };
  }
}

class CheckboxFacetHandler implements FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl {
    return formBuilder.array(
      Array.from(facet.data!.keys()).map(() => formBuilder.control(false))
    );
  }

  validateFacetConfig(facet: FacetConfig): true | string {
    if (!facet.data?.size) {
      return `Checkbox facet '${facet.key}' requires a non-empty 'data' property`;
    }

    return true;
  }
}

class MultiselectFacetHandler implements FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl {
    return formBuilder.control(null);
  }

  validateFacetConfig(facet: FacetConfig): true | string {
    if (!facet.data?.size) {
      return `Multiselect facet '${facet.key}' requires a non-empty 'data' property`;
    }

    return true;
  }
}

class YesNoFacetHandler implements FacetHandler {
  createControl(facet: FacetConfig, formBuilder: FormBuilder): AbstractControl {
    return formBuilder.control(null);
  }

  validateFacetConfig(facet: FacetConfig): true | string {
    return true;
  }
}
