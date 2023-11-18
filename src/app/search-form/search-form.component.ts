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
import {FormGroup, ReactiveFormsModule} from "@angular/forms";
import {MatRadioModule} from "@angular/material/radio";
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {FormOptions, FormService} from "./form.service";

@Component({
  selector: 'app-search-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatRadioModule, MatSelectModule, MatCheckboxModule, MatInputModule, MatButtonModule, MatIconModule],
  providers: [FormService],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.scss'
})
export class SearchFormComponent implements OnInit {

  @Input() facets: FacetConfig[] = [];
  @Input() minSearchLength?: number;
  @Input() maxSearchLength?: number;
  @Output() search = new EventEmitter<FilterModel>();

  // stores all validated facet configurations
  facetConfig: FacetConfig[] = []

  // the main form group
  searchForm!: FormGroup;

  @ViewChild('errorField') errorField!: ElementRef;

  FacetType = FacetType;

  private facetMappings = new Map<FacetType, Function>([
    [FacetType.Checkboxes, this.mapCheckboxesValue],
    [FacetType.Multiselect, this.mapMultiselectValue],
  ])

  searchTerm: string = '';
  minSearchLengthOption!: number;
  maxSearchLengthOption!: number;

  constructor(
    private formService: FormService
  ) {}

  ngOnInit() {
    this.searchForm = this.formService.createSearchForm(this.facets, {
      minSearchLength: this.minSearchLength,
      maxSearchLength: this.maxSearchLength,
    })

    this.facetConfig = this.formService.getFacetConfig();

    this.extractSanitizedOptions(this.formService.getOptions());
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

  preserveMapOrderComparator() {
    return 0;
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

  private extractSanitizedOptions(options: FormOptions) {
    this.minSearchLengthOption = options.minSearchLength!;
    this.maxSearchLengthOption = options.maxSearchLength!;
  }
}

