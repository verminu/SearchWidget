import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {SearchFormComponent} from "./search-form/search-form.component";
import {FacetsConfig, FilterModel} from "./search-form/search-form.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SearchFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'SearchComponent';

  searchConfig: FacetsConfig = [{
    key: 'isActive',
    type: 'yesNo',
    label: 'Active'
  }, {
    key: 'lang',
    type: 'multiselect',
    label: 'Language',
    data: [
      {key: 'en', label: 'English', },
      {key: 'ro', label: 'Romanian'},
      {key: 'pl', label: 'Polish'},
    ],
  }, {
    key: 'appType',
    type: 'checkboxes',
    label: 'Type',
    data: [
      {key: 'system', label: 'System'},
      {key: 'app', label: 'Application'},
      {key: 'web', label: 'Web'},
    ],
  }];

  search($event: FilterModel) {
    console.log($event);
  }
}
