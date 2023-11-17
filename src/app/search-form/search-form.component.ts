import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FacetConfig, FacetType, FilterModel} from "./search-form.model";
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
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
  @Input() facets: FacetConfig[] = [];
  @Output() search = new EventEmitter<FilterModel>();

  // stores all validated facet configurations
  facetsConfig: FacetConfig[] = []

  // the main form group
  searchForm: FormGroup = this.formBuilder.group({
    // represents the search input field
    searchTerm: [''],
    // group the facets under a separate key
    selections: this.formBuilder.group({})
  });

  FacetType = FacetType;

  // stores the facets keys for checking their uniqueness
  private facetKeys: string[] = [];

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    // dynamically create the form controls based on the provided input
    this.addSelectionFacetControls();
  }

  handleSearch() {
    // when the form is submitted, trigger the output event emitter
    this.search.emit(this.searchForm.value);
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
        }
        else {
          console.error(configValidation, facet);
          return;
        }
      }
      else {
        console.error(`Duplicate facet key ${facet.key}`, facet);
        return;
      }
    })
  }

  private addFacetFormControl(facet: FacetConfig) {
    let control: AbstractControl;

    // create a FormArray control if the facet contains checkboxes
    if (facet.type === FacetType.Checkboxes) {
      control = this.formBuilder.array(
        facet.data!.map(() => this.formBuilder.control(false))
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
        if (!facet.data?.length) {
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
}
