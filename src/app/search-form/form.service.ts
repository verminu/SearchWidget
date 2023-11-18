import { Injectable } from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn} from "@angular/forms";
import {FacetConfig, FacetType} from "./search-form.model";

@Injectable()
export class FormService {
  // stores the facets keys for checking their uniqueness
  private facetKeys: string[] = [];

  // stores all validated facet configurations
  private facetConfig: FacetConfig[] = [];

  constructor(private formBuilder: FormBuilder) {}

  // Method to create the search form
  createSearchForm(facets: FacetConfig[], options: {minSearchLength: number, maxSearchLength: number}): FormGroup {
    let form = this.formBuilder.group({
      searchTerm: ['', {
        validators: this.searchValidator(options.minSearchLength, options.maxSearchLength),
        updateOn: 'submit'
      }],
      selections: this.formBuilder.group({})
    });

    this.addSelectionFacetControls(form, facets);

    return form;
  }

  getFacetConfig() {
    return this.facetConfig;
  }

  private isFacetKeyUnique(facetKey: string) {
    return !this.facetKeys.includes(facetKey.toLowerCase());
  }

  private addSelectionFacetControls(form: FormGroup, facets: FacetConfig[]) {
    facets.forEach((facet) => {

      // check if the facet type has been used before
      if (this.isFacetKeyUnique(facet.key)) {

        // validate the facet config
        let configValidation = this.validateFacetConfig(facet);

        if (configValidation === true) {
          // create a new form control and add it to the main form group
          this.addFacetFormControl(facet, form);
          this.addFacetConfig(facet);
        } else {
          console.error(configValidation, facet);
          return;
        }
      } else {
        console.error(`Duplicate facet key ${facet.key}`, facet);
        return;
      }
    })
  }


  private addFacetFormControl(facet: FacetConfig, form: FormGroup) {
    let control: AbstractControl;

    // create a FormArray control if the facet contains checkboxes
    if (facet.type === FacetType.Checkboxes && facet.data) {
      control = this.formBuilder.array(
        Array.from(facet.data.keys())
          .map(() => this.formBuilder.control(false))
      );
    }
    // create a normal control
    else {
      control = this.formBuilder.control(null);
    }

    // add the control into the `selections` subgroup
    (form.get('selections') as FormGroup).addControl(facet.key, control);

    // store the facet key
    this.facetKeys.push(facet.key.toLowerCase());
  }

  private validateFacetConfig(facet: FacetConfig): true | string {
    switch (facet.type) {
      case FacetType.Checkboxes:
      case FacetType.Multiselect:
        // validate if the `data` property contains any values
        if (!facet.data?.size) {
          return "The facet config's 'data' property doesn't contain any values"
        }
        break;
    }

    return true;
  }

  /**
   * Store a valid facet configuration
   */
  private addFacetConfig(facet: FacetConfig) {
    this.facetConfig.push(facet);
  }

  private searchValidator(minLength: number, maxLength: number): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const input = control.value.trim();
      const isValid = input === '' || (input.length >= minLength && input.length <= maxLength);
      return isValid ? null : { 'searchInvalid': true };
    };
  }
}
