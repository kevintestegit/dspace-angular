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
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { getFirstCompletedRemoteData } from '../../../../app/core/shared/operators';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';

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

  protected readonly categories = [
    { configuration: 'pcirnNormas', title: 'pcirnNormas.search.results.head', icon: 'fa-file-signature' },
    { configuration: 'pcirnPops', title: 'pcirnPops.search.results.head', icon: 'fa-clipboard-list' },
    { configuration: 'pcirnPap', title: 'pcirnPap.search.results.head', icon: 'fa-folder-open' },
    { configuration: 'pcirnGuiasManuais', title: 'pcirnGuiasManuais.search.results.head', icon: 'fa-book-open' },
    { configuration: 'pcirnNotasTecnicas', title: 'pcirnNotasTecnicas.search.results.head', icon: 'fa-note-sticky' },
    { configuration: 'pcirnRelatorios', title: 'pcirnRelatorios.search.results.head', icon: 'fa-chart-column' },
    { configuration: 'pcirnMemoriaInstitucional', title: 'pcirnMemoriaInstitucional.search.results.head', icon: 'fa-landmark' },
  ];

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
