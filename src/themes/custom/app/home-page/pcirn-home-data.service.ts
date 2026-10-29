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
import { CommunityDataService } from '../../../../app/core/data/community-data.service';
import {
  buildPaginatedList,
  PaginatedList,
} from '../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../app/core/data/remote-data';
import { Community } from '../../../../app/core/shared/community.model';
import { DSpaceObjectType } from '../../../../app/core/shared/dspace-object-type.model';
import { Item } from '../../../../app/core/shared/item.model';
import { toDSpaceObjectListRD } from '../../../../app/core/shared/operators';
import { SearchService } from '../../../../app/core/shared/search/search.service';
import { PaginationComponentOptions } from '../../../../app/shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../../../app/shared/search/models/paginated-search-options.model';
import { PCIRN_COLLECTION_CATEGORIES } from '../shared/pcirn-collection-categories';

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
      title: 'Legislações e Portarias',
      description: 'Acesse legislações, portarias e atos oficiais.',
      icon: 'fa-gavel',
      route: '/search',
      queryParams: PCIRN_SEARCH_CONFIGURATIONS.regulations,
    },
    {
      titleKey: 'pcirn.home.quick-access.pops.title',
      descriptionKey: 'pcirn.home.quick-access.pops.desc',
      title: 'POP',
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
      title: 'Relatórios de Produtividade',
      description: 'Relatórios de produtividade e prestação de contas.',
      icon: 'fa-chart-bar',
      route: '/search',
      queryParams: PCIRN_SEARCH_CONFIGURATIONS.reports,
    },
  ];
}

@Injectable({ providedIn: 'root' })
export class PcirnHomeDataService {
  readonly featuredCommunities: Observable<RemoteData<PaginatedList<Community>>>;
  readonly latestPublications: Observable<RemoteData<PaginatedList<Item>>>;
  readonly metrics: Observable<RemoteData<PcirnHomeMetrics>>;

  constructor(
    private communityDataService: CommunityDataService,
    private searchService: SearchService,
  ) {
    this.featuredCommunities = this.buildFeaturedCommunities().pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.latestPublications = this.searchItems(3).pipe(
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.metrics = this.buildMetrics();
  }

  private buildFeaturedCommunities(): Observable<RemoteData<PaginatedList<Community>>> {
    return this.communityDataService.findTop({ elementsPerPage: 10 }).pipe(
      switchMap(rd => {
        if (!rd.hasSucceeded || !rd.payload || !rd.payload.page?.length) {
          return of(rd);
        }
        return combineLatest(rd.payload.page.map(community => this.communityItemCount(community.uuid).pipe(
          map(count => ({ community, count })),
        ))).pipe(
          take(1),
          map(pairs => {
            const top = pairs
              .sort((a, b) => b.count - a.count)
              .slice(0, 4)
              .map(pair => pair.community);
            const payload = buildPaginatedList(rd.payload.pageInfo, top);
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
    );
  }

  private communityItemCount(uuid: string): Observable<number> {
    const pagination = Object.assign(new PaginationComponentOptions(), {
      currentPage: 1,
      pageSize: 1,
    });
    return this.searchService.search<Item>(new PaginatedSearchOptions({
      dsoTypes: [DSpaceObjectType.ITEM],
      scope: uuid,
      pagination,
    })).pipe(
      toDSpaceObjectListRD(),
      filter(rd => rd.hasSucceeded || rd.hasFailed),
      map(rd => rd.hasSucceeded && rd.payload ? rd.payload.totalElements : 0),
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
      this.latestPublications,
    ]).pipe(
      map(([communities, items]) => {
        const states = [communities, items] as RemoteData<unknown>[];
        const failed = states.find(data => data.hasFailed);
        if (failed) {
          return failed as unknown as RemoteData<PcirnHomeMetrics>;
        }
        if (!communities.hasSucceeded || !communities.payload ||
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
            collections: PCIRN_COLLECTION_CATEGORIES.length,
            items: items.payload.totalElements,
          },
          communities.statusCode,
        );
      }),
    );
  }
}
