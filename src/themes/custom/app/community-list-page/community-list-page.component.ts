import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  catchError,
  EMPTY,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { APP_CONFIG } from 'src/config/app-config.interface';

import { CommunityListPageComponent as BaseComponent } from '../../../../app/community-list-page/community-list-page.component';
import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { CollectionDataService } from '../../../../app/core/data/collection-data.service';
import { CommunityDataService } from '../../../../app/core/data/community-data.service';
import { Community } from '../../../../app/core/shared/community.model';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import {
  getFirstCompletedRemoteData,
  getFirstSucceededRemoteData,
} from '../../../../app/core/shared/operators';
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';

export function getCommunityIcon(name: string): string {
  const n = normalizeSearchTerm(name);
  if (n.includes('criminalistica')) return 'fa-microscope';
  if (n.includes('identificacao') || n.includes('(ii)')) return 'fa-fingerprint';
  if (n.includes('medicina legal') || n.includes('(iml)')) return 'fa-dna';
  if (n.includes('nugecid') || n.includes('memoria') || n.includes('conhecimento')) return 'fa-box-archive';
  if (n.includes('gestao') || n.includes('(dg)')) return 'fa-building-columns';
  if (n.includes('corregedoria') || n.includes('ouvidoria') || n.includes('juridico') || n.includes('direito')) return 'fa-scale-balanced';
  if (n.includes('ensino') || n.includes('academia') || n.includes('treinamento') || n.includes('capacitacao')) return 'fa-graduation-cap';
  if (n.includes('tecnologia') || n.includes('informatica') || n.includes('ti') || n.includes('sistemas')) return 'fa-server';
  if (n.includes('contabil') || n.includes('financeir') || n.includes('orcament')) return 'fa-calculator';
  return 'fa-file-lines';
}

export interface CommunityCounts {
  collections: number;
  items: number;
}

export interface PcirnCommunityCard {
  community: Community;
  icon: string;
  name: string;
  highlightedName: string;
  collectionsCount?: number;
  itemsCount?: number;
}

export function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
  }[m] || m));
}

export function highlightMatches(text: string, term: string): string {
  if (!term || !term.trim()) {
    return escapeHtml(text);
  }
  const cleanTerm = term.trim();
  const escapedText = escapeHtml(text);
  const regex = new RegExp(`(${cleanTerm.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')})`, 'gi');
  return escapedText.replace(regex, '<mark>$1</mark>');
}

export function normalizeSearchTerm(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterCommunityCards(cards: PcirnCommunityCard[], term: string): PcirnCommunityCard[] {
  const needle = normalizeSearchTerm(term);
  if (needle.length === 0) {
    return cards.map(c => ({ ...c, highlightedName: escapeHtml(c.name) }));
  }
  return cards
    .filter(card =>
      normalizeSearchTerm(card.name).includes(needle) ||
      normalizeSearchTerm(card.community.shortDescription ?? '').includes(needle))
    .map(card => ({
      ...card,
      highlightedName: highlightMatches(card.name, term),
    }));
}

@Component({
  selector: 'ds-themed-community-list-page',
  templateUrl: './community-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class CommunityListPageComponent extends BaseComponent {
  private readonly communityDataService = inject(CommunityDataService);
  private readonly collectionDataService = inject(CollectionDataService);
  private readonly searchService = inject(SearchService);
  private readonly dsoNameService = inject(DSONameService);
  private readonly pageSize = inject(APP_CONFIG).communityList.pageSize;

  protected readonly query = signal('');
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  private readonly communities = signal<Community[]>([]);
  private readonly counts = signal<Record<string, CommunityCounts>>({});

  protected readonly cards = computed<PcirnCommunityCard[]>(() => {
    const countsMap = this.counts();
    return this.communities().map((community) => {
      const name = this.dsoNameService.getName(community);
      const communityCounts = countsMap[community.id];
      return {
        community,
        icon: getCommunityIcon(name),
        name,
        highlightedName: escapeHtml(name),
        collectionsCount: communityCounts?.collections,
        itemsCount: communityCounts?.items,
      };
    });
  });
  protected readonly results = computed(() => filterCommunityCards(this.cards(), this.query()));

  constructor() {
    super();
    this.fetchAll(1, []).pipe(
      catchError(() => {
        this.failed.set(true);
        this.loading.set(false);
        return EMPTY;
      }),
    ).subscribe((communities) => {
      this.communities.set(communities);
      this.loading.set(false);
      this.fetchCounts(communities);
    });
  }

  private fetchCounts(communities: Community[]): void {
    for (const community of communities) {
      const collections$ = this.collectionDataService.findByParent(community.id, { elementsPerPage: 1 }).pipe(
        getFirstCompletedRemoteData(),
        map((rd) => (rd.hasSucceeded && rd.payload ? rd.payload.totalElements : 0)),
        catchError(() => of(0)),
      );

      const searchOptions = new PaginatedSearchOptions({
        scope: community.id,
        dsoTypes: [DSpaceObjectType.ITEM],
        pagination: Object.assign(new PaginationComponentOptions(), { pageSize: 1, currentPage: 1 }),
      });

      const items$ = this.searchService.search(searchOptions).pipe(
        getFirstCompletedRemoteData(),
        map((rd) => (rd.hasSucceeded && rd.payload ? rd.payload.totalElements : 0)),
        catchError(() => of(0)),
      );

      forkJoin({ collections: collections$, items: items$ }).subscribe(({ collections, items }) => {
        this.counts.update((prev) => ({
          ...prev,
          [community.id]: { collections, items },
        }));
      });
    }
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  protected clearSearch(): void {
    this.query.set('');
  }

  private fetchAll(currentPage: number, collected: Community[]): Observable<Community[]> {
    return this.communityDataService.findTop({
      currentPage,
      elementsPerPage: this.pageSize,
    }).pipe(
      getFirstSucceededRemoteData(),
      switchMap((remoteData) => {
        const page = remoteData.payload;
        const communities = [...collected, ...page.page];
        return page.currentPage < page.totalPages
          ? this.fetchAll(page.currentPage + 1, communities)
          : of(communities);
      }),
    );
  }
}
