import {FacetsConfig, FacetType, ResultsColumn} from "./shared/search-widget/search-widget.model";
import {FormOptions} from "./shared/search-widget/form.service";

const bookGenres = ['Science Fiction', 'Fantasy', 'Adventure', 'Romance', 'Mystery', 'Historical Fiction', 'Drama', 'Philosophy', 'Mythology'];
const bookLanguages = ['English', 'Chinese', 'French', 'Spanish', 'Arabic', 'Italian', 'Japanese', 'Korean', 'Swedish', 'German', 'Russian', 'Greek', 'Swahili', 'Portuguese'];
const bookTypes = ['Hardcover', 'Anthology', 'Illustrated Edition', 'Paperback', 'First Edition', 'Graphic Novel', 'Biography', 'Novella', 'Textbook', 'Play', 'Encyclopedia', 'Short Story Collection', 'Memoir', 'Travel Guide', 'Poetry Collection', 'Journal', 'Academic Paper', 'Detective Novel', 'Novel', 'Ebook', 'Historical Novel', 'Travelogue', 'Manga', 'Collection'];

export const resultsColumns: ResultsColumn[] = [
  ['title', 'Title'],
  ['author', 'Author'],
  ['language', 'Language'],
  ['genre', 'Genre'],
  ['type', 'Type'],
  ['isAvailable', 'Availability'],
  ['isDigitalFormat', 'E-book'],
]

export const searchWidgetParams: FormOptions = {
  minSearchLength: 2,
  maxSearchLength: 20
}

export const searchWidgetConfig: FacetsConfig = [
  {
    key: 'genre',
    label: 'Genre',
    type: FacetType.Multiselect,
    data: bookGenres
  },
  {
    key: 'language',
    label: 'Language',
    type: FacetType.Multiselect,
    data: bookLanguages
  },
  {
    key: 'isAvailable',
    label: 'Available',
    type: FacetType.YesNo
  },
  {
    key: 'isDigitalFormat',
    label: 'E-book',
    type: FacetType.YesNo
  },
  {
    key: 'type',
    label: 'Type',
    type: FacetType.Checkboxes,
    data: bookTypes
  }
]
