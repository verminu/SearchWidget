import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {CommonModule} from '@angular/common';
import {
  FacetConfig,
  FacetSelection,
  FacetType,
  FilterModel, ListSelection,
} from "./search-form.model";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidatorFn} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatSelectModule, MatCheckboxModule, MatInputModule, MatButtonModule, MatIconModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {
  private readonly MAX_SEARCH_LENGTH_LIMIT = 50;
  private readonly MIN_SEARCH_LENGTH = 3;
  private readonly MAX_SEARCH_LENGTH = 20;

  @Input() facets: FacetConfig[] = [];
  @Input() minSearchLength = this.MIN_SEARCH_LENGTH;
  @Input() maxSearchLength = this.MAX_SEARCH_LENGTH;
  @Output() search = new EventEmitter<FilterModel>();

  // stores all validated facet configurations
  facetsConfig: FacetConfig[] = []

  // the main form group
  searchForm!: FormGroup;

  @ViewChild('errorField') errorField!: ElementRef;

  FacetType = FacetType;

  // stores the facets keys for checking their uniqueness
  private facetKeys: string[] = [];
  private facetMappings = new Map<FacetType, Function>([
    [FacetType.Checkboxes, this.mapCheckboxesValue],
    [FacetType.Multiselect, this.mapMultiselectValue],
  ])

  searchTerm: string = '';

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // validate search inputs
    this.validateSearchLengths();

    // the main form group
    this.searchForm = this.formBuilder.group({
      // represents the search input field
      searchTerm: ['', {
        validators: searchValidator(this.minSearchLength, this.maxSearchLength),
        updateOn: 'submit'
      }],
      // group the facets under a separate key
      selections: this.formBuilder.group({})
    });

    // dynamically create the form controls based on the provided input
    this.addSelectionFacetControls();
  }

  /**
   * When the form is submitted, trigger the output event emitter.
   */
  handleSearch() {
    if (this.searchForm.invalid) {
      this.searchForm.markAllAsTouched();
      this.scrollToError();
      return;
    }

    // apply data mapping to raw filter values
    const filters = this.mapRawValues(this.searchForm.value);
    this.search.emit(filters);
  }

  resetForm() {
    // Reset the form here
    this.searchForm.reset({
      searchTerm: '', // Reset searchTerm to empty string
      selections: this.buildInitialSelections() // Reset selections to initial state
    });
  }

  private validateSearchLengths() {
    if (this.minSearchLength <= 0 || this.minSearchLength > this.MAX_SEARCH_LENGTH_LIMIT ||
      this.maxSearchLength <= 0 || this.maxSearchLength > this.MAX_SEARCH_LENGTH_LIMIT ||
      this.maxSearchLength <= this.minSearchLength) {

      console.error(`Invalid search lengths. Reverting to default values.`);

      this.minSearchLength = this.MIN_SEARCH_LENGTH;
      this.maxSearchLength = this.MAX_SEARCH_LENGTH;
    }
  }

  private buildInitialSelections(): Record<string, any> {
    const selectionsGroup: Record<string, any> = {};

    this.facets.forEach(facet => {
      if (facet.type === FacetType.Checkboxes && facet.data) {
        selectionsGroup[facet.key] = Array.from(facet.data.keys()).map(() => false);
      } else {
        selectionsGroup[facet.key] = null;
      }
    });

    return selectionsGroup;
  }


  /**
   * Create the widgets based on the provided configuration from the `facets` input property
   */
  private addSelectionFacetControls() {
    this.facets.forEach((facet) => {

      // check if the facet type has been used before
      if (this.isFacetKeyUnique(facet.key)) {

        // validate the facet config
        let configValidation = this.validateFacetConfig(facet);

        if (configValidation === true) {
          // create a new form control and add it to the main form group
          this.addFacetFormControl(facet);
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

  private addFacetFormControl(facet: FacetConfig) {
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
    (this.searchForm.get('selections') as FormGroup).addControl(facet.key, control);

    // store the facet key
    this.facetKeys.push(facet.key.toLowerCase());
  }

  private isFacetKeyUnique(facetKey: string) {
    return !this.facetKeys.includes(facetKey.toLowerCase());
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
    this.facetsConfig.push(facet);
  }

  private mapRawValues(formValue: any): FilterModel {
    const filters: FilterModel = {}

    // add the search term only if it has a value
    const sanitizedSearchTerm = this.sanitizeSearchTerm(formValue.searchTerm);
    if (sanitizedSearchTerm !== undefined) {
      filters.searchTerm = sanitizedSearchTerm;
    }

    // extract the raw selected values from the form controls
    const selectionsRawValue = formValue.selections;

    let sanitizedSelection;

    // iterate over each facet key in the selections
    for (const facetKey of Object.keys(selectionsRawValue)) {
      // extract the raw selection value
      const facetValue = selectionsRawValue[facetKey];

      // transform the raw value of a facet control
      const facetSelection = this.mapRawSelection(facetValue, facetKey);

      // keep the facet selection only if it exists
      if (facetSelection !== undefined) {
        if (sanitizedSelection === undefined) {
          sanitizedSelection = {} as { [facetKey: string]: any };
        }

        sanitizedSelection[facetKey] = facetSelection;
      }
    }

    if (sanitizedSelection) {
      filters.selections = sanitizedSelection;
    }

    return filters;
  }

  private sanitizeSearchTerm(input: string): string | undefined {
    const trimmedInput = input.trim();

    return trimmedInput ? trimmedInput : undefined;
  }

  private mapRawSelection(facetValue: any, facetKey: string): FacetSelection | undefined {
    const facetType = this.getFacetTypeByKey(facetKey);

    const mappingFn = this.facetMappings.get(facetType);

    return mappingFn ? mappingFn.call(this, facetValue, facetKey) : facetValue;
  }

  private getFacetTypeByKey(facetKey: string): FacetType {
    return this.facets.find(facet => facet.key === facetKey)!.type;
  }

  private mapCheckboxesValue(checkboxValues: boolean[], facetKey: string): ListSelection | undefined {
    // get the provided input config for the specified facet
    const facetConfig = this.facets.find(facet => facet.key === facetKey);

    if (!facetConfig || !facetConfig.data) return undefined;

    // extract from the facet config only the values that are marked as checked in the checkbox list
    const selections =
      Array.from(facetConfig.data.entries())
        .filter(([], index) => checkboxValues[index])
        .map(([key, label]): [string, string] => ([key, label]));

    return selections.length ? selections : undefined;
  }

  private mapMultiselectValue(multiselectValues: boolean[] | null) {
    return multiselectValues?.length ? multiselectValues : undefined;
  }

  private scrollToError() {
    this.errorField.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.errorField.nativeElement.focus();
  }

  updateSearchTerm(event: Event) {
    this.searchTerm = (event.target as HTMLInputElement).value;
  }
}

function searchValidator(minLength: number, maxLength: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const input = control.value.trim();
    const isValid = input === '' || (input.length >= minLength && input.length <= maxLength);
    return isValid ? null : { 'searchInvalid': true };
  };
}
