import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterOutlet} from '@angular/router';
import {SearchFormComponent} from "./search-form/search-form.component";
import {FacetsConfig, FacetType, FilterModel} from "./search-form/search-form.model";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SearchFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'SearchComponent';

  searchConfig: FacetsConfig = [
    {
      key: 'isActive',
      type: FacetType.YesNo,
      label: 'Active'
    },
    {
      key: 'lang',
      type: FacetType.Multiselect,
      label: 'Language',
      data: new Map([
          ['en', 'English'],
          ['ro', 'Romanian'],
          ['pl', 'Polish'],
          ['fr', 'French'],
          ['de', 'German'],
          ['es', 'Spanish'],
          ['it', 'Italian'],
          ['jp', 'Japanese'],
          ['cn', 'Chinese'],
      ]),
    },
    {
      key: 'isActive_1',
      type: FacetType.YesNo,
      label: 'Active'
    },
    {
      key: 'appType',
      type: FacetType.Checkboxes,
      label: 'Type',
      data: new Map([
          ['system', 'System'],
          ['app', 'Application'],
          ['web', 'Web'],
          ['mobile', 'Mobile'],
          ['desktop', 'Desktop'],
          ['cloud', 'Cloud'],
          ['iot', 'IoT'],
          ['ai', 'Artificial Intelligence'],
          ['ml', 'Machine Learning'],
          ['data', 'Data Analysis'],
          ['network', 'Networking'],
          ['security', 'Security'],
          ['blockchain', 'Blockchain'],
      ]),
    },
    {
      key: 'lang_2',
      type: FacetType.Multiselect,
      label: 'Language',
      data: new Map([
          ['jp', 'Japanese'],
          ['cn', 'Chinese'],
          ['pt', 'Portuguese'],
          ['nl', 'Dutch'],
          ['ko', 'Korean'],
          ['ar', 'Arabic'],
          ['sv', 'Swedish'],
          ['no', 'Norwegian'],
      ]),
    },
    {
      key: 'appType_2',
      type: FacetType.Checkboxes,
      label: 'Type',
      data: new Map([
          ['security', 'Security'],
          ['blockchain', 'Blockchain'],
          ['vr', 'Virtual Reality'],
          ['ar', 'Augmented Reality'],
          ['gaming', 'Gaming'],
          ['software', 'Software Development'],
          ['hardware', 'Hardware'],
          ['database', 'Database'],
          ['devops', 'DevOps'],
          ['qa', 'Quality Assurance'],
          ['uiux', 'UI/UX Design'],
          ['e-commerce', 'E-commerce'],
      ]),
    },
  ];

  ngOnInit() {

  }

  search(filters: FilterModel) {
    console.log(filters);
  }
}
