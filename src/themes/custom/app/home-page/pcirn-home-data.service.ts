import { Injectable } from '@angular/core';
import { Params } from '@angular/router';
import {
  combineLatest,
  Observable,
  shareReplay,
} from 'rxjs';
import { map } from 'rxjs/operators';

import { CommunityDataService } from '../../../../app/core/data/community-data.service';
import { CollectionDataService } from '../../../../app/core/data/collection-data.service';
import { FindListOptions } from '../../../../app/core/data/find-list-options.model';
import { PaginatedList } from '../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { Collection } from '../../../../app/core/shared/collection.model';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { Item } from '../../../../app/core/shared/item.model';
import { toDSpaceObjectListRD } from '../../../../app/core/shared/operators';
import { SortDirection } from '../../../../app/core/cache/models/sort-options.model';
import { SortOptions } from '../../../../app/core/cache/models/sort-options.model';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';
import { SearchService } from '../../../../app/core/shared/search/search.service';

export interface PcirnQuickAccessCard {
  titleKey: string;
  descriptionKey: string;
  title: string;
  description: string;
  icon: string;
  route: string;
  queryParams?: Params;
  requiresLogin: boolean;
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

export function buildQuickAccess(isAuthenticated: boolean): PcirnQuickAccessCard[] {
  const privateRoute = isAuthenticated ? '/search' : '/login';
  const filter = (key: string): Params | undefined =>
    isAuthenticated || key === 'regulations' ? PCIRN_SEARCH_CONFIGURATIONS[key] : undefined;
  return [
    {
      titleKey: 'pcirn.home.quick-access.regulations.title',
      descriptionKey: 'pcirn.home.quick-access.regulations.desc',
      title: 'Normas e Portarias',
      description: 'Acesse normas, portarias e atos oficiais.',
      icon: 'fa-gavel',
      route: '/search',
      queryParams: filter('regulations'),
      requiresLogin: false,
    },
    {
      titleKey: 'pcirn.home.quick-access.pops.title',
      descriptionKey: 'pcirn.home.quick-access.pops.desc',
      title: 'POPs e Procedimentos',
      description: 'Procedimentos operacionais e fluxos de trabalho.',
      icon: 'fa-clipboard-list',
      route: privateRoute,
      queryParams: filter('pops'),
      requiresLogin: true,
    },
    {
      titleKey: 'pcirn.home.quick-access.research.title',
      descriptionKey: 'pcirn.home.quick-access.research.desc',
      title: 'Produção Científica',
      description: 'Artigos, estudos e publicações científicas.',
      icon: 'fa-microscope',
      route: privateRoute,
      queryParams: filter('research'),
      requiresLogin: true,
    },
    {
      titleKey: 'pcirn.home.quick-access.reports.title',
      descriptionKey: 'pcirn.home.quick-access.reports.desc',
      title: 'Relatórios Técnicos',
      description: 'Relatórios, pareceres e documentos técnicos.',
      icon: 'fa-chart-bar',
      route: privateRoute,
      queryParams: filter('reports'),
      requiresLogin: true,
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class PcirnHomeDataService {
  readonly featuredCollections: Observable<RemoteData<PaginatedList<Collection>>>;
  readonly latestPublications: Observable<RemoteData<PaginatedList<Item>>>;
  readonly metrics: Observable<RemoteData<PcirnHomeMetrics>>;

  constructor(
    private communityDataService: CommunityDataService,
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
  ) {
    const listOptions: FindListOptions = { elementsPerPage: 6 };
    this.featuredCollections = collectionDataService.findAll(listOptions).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.latestPublications = this.searchItems(6).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.metrics = this.buildMetrics();
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
      this.featuredCollections,
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
