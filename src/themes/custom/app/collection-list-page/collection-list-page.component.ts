import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  forkJoin,
  map,
  of,
} from 'rxjs';

import { CollectionListPageComponent as BaseComponent } from '../../../../app/collection-list-page/collection-list-page.component';
import { getFirstCompletedRemoteData } from '../../../../app/core/shared/operators';
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';
import { PCIRN_COLLECTION_CATEGORIES } from '../shared/pcirn-collection-categories';

@Component({
  selector: 'ds-themed-collection-list-page',
  templateUrl: './collection-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    TranslateModule,
  ],
})
export class CollectionListPageComponent extends BaseComponent {
  private readonly searchService = inject(SearchService);

  protected readonly categories = PCIRN_COLLECTION_CATEGORIES;

  protected readonly itemCounts = signal<Record<string, number>>({});

  constructor() {
    super();

    forkJoin(this.categories.map(category => this.searchService.search(new PaginatedSearchOptions({
      configuration: category.configuration,
      pagination: Object.assign(new PaginationComponentOptions(), { currentPage: 1, pageSize: 1 }),
    })).pipe(
      getFirstCompletedRemoteData(),
      map(data => data.hasSucceeded && data.payload ? data.payload.totalElements : 0),
      catchError(() => of(0)),
    ))).subscribe(counts => {
      this.itemCounts.set(Object.fromEntries(this.categories.map((category, index) => [
        category.configuration,
        counts[index],
      ])));
    });
  }
}
