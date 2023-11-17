import {Component} from '@angular/core';
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
export class AppComponent {
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
      data: [
        {key: 'en', label: 'English',},
        {key: 'ro', label: 'Romanian'},
        {key: 'pl', label: 'Polish'},
        {key: 'fr', label: 'French'},
        {key: 'de', label: 'German'},
        {key: 'es', label: 'Spanish'},
        {key: 'it', label: 'Italian'},
        {key: 'jp', label: 'Japanese'},
        {key: 'cn', label: 'Chinese'},
        {key: 'pt', label: 'Portuguese'},
        {key: 'nl', label: 'Dutch'},
        {key: 'ko', label: 'Korean'},
        {key: 'ar', label: 'Arabic'},
        {key: 'sv', label: 'Swedish'},
        {key: 'no', label: 'Norwegian'}

      ],
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
      data: [
        {key: 'system', label: 'System'},
        {key: 'app', label: 'Application'},
        {key: 'web', label: 'Web'},
        {key: 'mobile', label: 'Mobile'},
        {key: 'desktop', label: 'Desktop'},
        {key: 'cloud', label: 'Cloud'},
        {key: 'iot', label: 'IoT'},
        {key: 'ai', label: 'Artificial Intelligence'},
        {key: 'ml', label: 'Machine Learning'},
        {key: 'data', label: 'Data Analysis'},
        {key: 'network', label: 'Networking'},
        {key: 'security', label: 'Security'},
        {key: 'blockchain', label: 'Blockchain'},
        {key: 'vr', label: 'Virtual Reality'},
        {key: 'ar', label: 'Augmented Reality'},
        {key: 'gaming', label: 'Gaming'},
        {key: 'software', label: 'Software Development'},
        {key: 'hardware', label: 'Hardware'},
        {key: 'database', label: 'Database'},
        {key: 'devops', label: 'DevOps'},
        {key: 'qa', label: 'Quality Assurance'},
        {key: 'uiux', label: 'UI/UX Design'},
        {key: 'e-commerce', label: 'E-commerce'},
      ],
    },
    {
      key: 'lang_2',
      type: FacetType.Multiselect,
      label: 'Language',
      data: [
        {key: 'en', label: 'English',},
        {key: 'ro', label: 'Romanian'},
        {key: 'pl', label: 'Polish'},
        {key: 'fr', label: 'French'},
        {key: 'de', label: 'German'},
        {key: 'es', label: 'Spanish'},
        {key: 'it', label: 'Italian'},
        {key: 'jp', label: 'Japanese'},
        {key: 'cn', label: 'Chinese'},
        {key: 'pt', label: 'Portuguese'},
        {key: 'nl', label: 'Dutch'},
        {key: 'ko', label: 'Korean'},
        {key: 'ar', label: 'Arabic'},
        {key: 'sv', label: 'Swedish'},
        {key: 'no', label: 'Norwegian'}

      ],
    },
  ];

  search(filters: FilterModel) {
    console.log(filters);
  }
}
