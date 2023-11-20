import {Injectable} from '@angular/core';
import {FilterModel} from "./shared/search-widget/search-widget.model";
import {delay, Observable, of, tap, timer} from "rxjs";
import {books} from "../db";

export type BookModel = {
  title: string,
  author: string,
  language: string,
  genre: string,
  isAvailable: boolean,
  isDigitalFormat: boolean,
  type: string
}

@Injectable({
  providedIn: 'root',
})
export class SearchService {

  constructor() {
  }

  search(criteria: FilterModel): Observable<BookModel[]> {
    return of(this.filterBooks(criteria)).pipe(
      delay(1000),
    );

    // return (timer(1000).pipe(
    //   tap(() => {
    //     throw new Error("an unexpected error occurred");
    //   })
    // ) as unknown as Observable<BookModel[]>)
  }

  private filterBooks(criteria: FilterModel): BookModel[] {
    if (!criteria) {
      return books;
    }

    const searchTermWords = criteria.searchTerm?.toLowerCase().split(' ') || [];
    const {selections} = criteria;

    return books.filter((book: BookModel) => {
      // Check for search term
      const searchTermMatch = searchTermWords.length === 0 || searchTermWords.every(word =>
        book.title.toLowerCase().includes(word) ||
        book.author.toLowerCase().includes(word) ||
        book.genre.toLowerCase().includes(word) ||
        book.language.toLowerCase().includes(word) ||
        book.type.toLowerCase().includes(word)
      );

      // Check for other filters
      const genreMatch = !selections?.['genre'] || (selections['genre'] as Array<string>).some(genre => book.genre === genre);
      const languageMatch = !selections?.['language'] || (selections['language'] as Array<string>).some(language => book.language === language);
      const isAvailableMatch = selections?.['isAvailable'] === undefined || book.isAvailable === selections['isAvailable'];
      const isDigitalFormatMatch = selections?.['isDigitalFormat'] === undefined || book.isDigitalFormat === selections['isDigitalFormat'];
      const typeMatch = !selections?.['type'] || (selections['type'] as Array<string>).some(type => book.type === type);

      return searchTermMatch && genreMatch && languageMatch && isAvailableMatch && isDigitalFormatMatch && typeMatch;
    }).sort((a, b) => a.title.localeCompare(b.title));
  }
}
