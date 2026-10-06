import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  combineLatest,
  Observable,
  of,
  shareReplay,
} from 'rxjs';
import {
  filter,
  map,
  switchMap,
  take,
} from 'rxjs/operators';

import {
  SortDirection,
  SortOptions,
} from '../../../../app/core/cache/models/sort-options.model';
import { CollectionDataService } from '../../../../app/core/data/collection-data.service';
import { CommunityDataService } from '../../../../app/core/data/community-data.service';
import { FindListOptions } from '../../../../app/core/data/find-list-options.model';
import { PaginatedList } from '../../../../app/core/data/paginated-list.model';
import { buildPaginatedList } from '../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { Collection } from '../../../../app/core/shared/collection.model';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { Item } from '../../../../app/core/shared/item.model';
import { toDSpaceObjectListRD } from '../../../../app/core/shared/operators';
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';

export interface PcirnQuickAccessCard {
  titleKey: string;
  descriptionKey: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  queryParams?: Params;
}

export interface PcirnHomeMetrics {
  communities: number;
  collections: number;
  items: number;
}

export const PCIRN_SEARCH_CONFIGURATIONS: Record<string, Params> = {
  regulations: { configuration: 'pcirnNormas' },
  pops: { configuration: 'pcirnPops' },
  research: { configuration: 'pcirnProducao' },
  reports: { configuration: 'pcirnRelatorios' },
};

/** Build the public searches offered by the home page. */
export function buildQuickAccess(): PcirnQuickAccessCard[] {
  return [
    {
      titleKey: 'pcirn.home.quick-access.regulations.title',
      descriptionKey: 'pcirn.home.quick-access.regulations.desc',
      title: 'Normas e Portarias',
      description: 'Acesse normas, portarias e atos oficiais.',
      icon: 'fa-gavel',
      route: '/search',
      queryParams: PCIRN_SEARCH_CONFIGURATIONS.regulations,
    },
    {
      titleKey: 'pcirn.home.quick-access.pops.title',
      descriptionKey: 'pcirn.home.quick-access.pops.desc',
      title: 'POPs e Procedimentos',
      description: 'Procedimentos operacionais e fluxos de trabalho.',
      icon: 'fa-clipboard-list',
      route: '/search',
      queryParams: PCIRN_SEARCH_CONFIGURATIONS.pops,
    },
    {
      titleKey: 'pcirn.home.quick-access.research.title',
      descriptionKey: 'pcirn.home.quick-access.research.desc',
      title: 'Produção Científica',
      description: 'Artigos, estudos e publicações científicas.',
      icon: 'fa-microscope',
      route: '/search',
      queryParams: PCIRN_SEARCH_CONFIGURATIONS.research,
    },
    {
      titleKey: 'pcirn.home.quick-access.reports.title',
      descriptionKey: 'pcirn.home.quick-access.reports.desc',
      title: 'Relatórios Técnicos',
      description: 'Relatórios, pareceres e documentos técnicos.',
      icon: 'fa-chart-bar',
      route: '/search',
      queryParams: PCIRN_SEARCH_CONFIGURATIONS.reports,
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class PcirnHomeDataService {
  readonly featuredCollections: Observable<RemoteData<PaginatedList<Collection>>>;
  readonly latestPublications: Observable<RemoteData<PaginatedList<Item>>>;
  readonly metrics: Observable<RemoteData<PcirnHomeMetrics>>;
  readonly allCollections: Observable<RemoteData<PaginatedList<Collection>>>;

  constructor(
    private communityDataService: CommunityDataService,
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
  ) {
    const listOptions: FindListOptions = { elementsPerPage: 12 };
    const allCollections = collectionDataService.findAll(listOptions).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.allCollections = allCollections;
    this.featuredCollections = allCollections.pipe(
      switchMap(rd => {
        if (!rd.hasSucceeded || !rd.payload) {
          return of(rd);
        }
        return combineLatest(rd.payload.page.map(c => this.latestItemDate(c.uuid).pipe(
          map(date => ({ collection: c, date })),
        ))).pipe(
          take(1),
          map(pairs => {
            const active = pairs
              .filter(p => p.date !== null)
              .sort((a, b) => b.date.localeCompare(a.date))
              .map(p => p.collection);
            const payload = buildPaginatedList(rd.payload.pageInfo, active);
            return new RemoteData(
              rd.timeCompleted,
              rd.msToLive,
              rd.lastUpdated,
              rd.state,
              undefined,
              payload,
              rd.statusCode,
            );
          }),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.latestPublications = this.searchItems(6).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.metrics = this.buildMetrics();
  }

  private latestItemDate(uuid: string): Observable<string | null> {
    const pagination = Object.assign(new PaginationComponentOptions(), {
      currentPage: 1,
      pageSize: 1,
    });
    return this.searchService.search<Item>(new PaginatedSearchOptions({
      dsoTypes: [DSpaceObjectType.ITEM],
      scope: uuid,
      pagination,
      sort: new SortOptions('dc.date.accessioned', SortDirection.DESC),
    })).pipe(
      toDSpaceObjectListRD(),
      filter(rd => rd.hasSucceeded || rd.hasFailed),
      map(rd => {
        if (!rd.hasSucceeded || !rd.payload || !rd.payload.page?.length) {
          return null;
        }
        const item = rd.payload.page[0] as Item;
        return item.metadata?.['dc.date.accessioned']?.[0]?.value || '0000-00-00';
      }),
    );
  }

  private searchItems(pageSize: number): Observable<RemoteData<PaginatedList<Item>>> {
    const pagination = Object.assign(new PaginationComponentOptions(), {
      currentPage: 1,
      pageSize,
    });

    return this.searchService.search<Item>(new PaginatedSearchOptions({
      dsoTypes: [DSpaceObjectType.ITEM],
      pagination,
      sort: new SortOptions('dc.date.accessioned', SortDirection.DESC),
    })).pipe(
      toDSpaceObjectListRD(),
    ) as Observable<RemoteData<PaginatedList<Item>>>;
  }

  private buildMetrics(): Observable<RemoteData<PcirnHomeMetrics>> {
    return combineLatest([
      this.communityDataService.findTop({ elementsPerPage: 1 }),
      this.allCollections,
      this.latestPublications,
    ]).pipe(
      map(([communities, collections, items]) => {
        const states = [communities, collections, items] as RemoteData<unknown>[];
        const failed = states.find(data => data.hasFailed);
        if (failed) {
          return failed as unknown as RemoteData<PcirnHomeMetrics>;
        }
        if (!communities.hasSucceeded || !communities.payload ||
          !collections.hasSucceeded || !collections.payload ||
          !items.hasSucceeded || !items.payload) {
          const incomplete = states.find(data => !data.hasSucceeded || !data.payload);
          return incomplete as unknown as RemoteData<PcirnHomeMetrics>;
        }
        return new RemoteData(
          communities.timeCompleted,
          communities.msToLive,
          communities.lastUpdated,
          communities.state,
          undefined,
          {
            communities: communities.payload.totalElements,
            collections: collections.payload.totalElements,
            items: items.payload.totalElements,
          },
          communities.statusCode,
        );
      }),
    );
  }
}
