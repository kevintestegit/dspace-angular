import { buildPaginatedList } from '../../../../app/core/data/paginated-list.model';
import {
  createFailedRemoteDataObject$,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../../app/shared/remote-data.utils';
import { PCIRN_COLLECTION_CATEGORIES } from '../shared/pcirn-collection-categories';
import {
  buildQuickAccess,
  PcirnHomeDataService,
} from './pcirn-home-data.service';

describe('buildQuickAccess', () => {
  it('opens public filtered searches regardless of authentication', () => {
    const cards = buildQuickAccess();
    expect(cards.length).toBe(4);
    expect(cards.map(card => card.queryParams.configuration)).toEqual([
      'pcirnNormas', 'pcirnPops', 'pcirnProducao', 'pcirnRelatorios',
    ]);
    expect(cards.every(card => card.route === '/search')).toBeTrue();
  });
});

describe('PcirnHomeDataService', () => {
  it('loads the latest three publications from one search', () => {
    let searchCalls = 0;
    let searchPageSize: number;
    const emptyPage = buildPaginatedList(undefined, []);

    new PcirnHomeDataService(
      { findTop: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
      {
        search: options => {
          searchCalls++;
          searchPageSize = options.pagination.pageSize;
          return createSuccessfulRemoteDataObject$(emptyPage);
        },
      } as any,
    );

    expect(searchCalls).toBe(1);
    expect(searchPageSize).toBe(3);
  });

  it('features the four communities with the most items', done => {
    const communities = [
      { id: 'dg', uuid: 'dg' },
      { id: 'ic', uuid: 'ic' },
      { id: 'ii', uuid: 'ii' },
      { id: 'iml', uuid: 'iml' },
      { id: 'nu', uuid: 'nu' },
    ] as any[];
    const counts: Record<string, number> = { dg: 4, ic: 3, ii: 1, iml: 2, nu: 0 };
    const service = new PcirnHomeDataService(
      { findTop: () => createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, communities)) } as any,
      {
        search: options => createSuccessfulRemoteDataObject$(
          buildPaginatedList(undefined, new Array(counts[options.scope]).fill({})),
        ),
      } as any,
    );

    service.featuredCommunities.subscribe(featured => {
      expect(featured.hasSucceeded).toBeTrue();
      expect(featured.payload.page.map(community => community.id)).toEqual(['dg', 'ic', 'iml', 'ii']);
      done();
    });
  });

  it('derives the collections metric from the shared category list', done => {
    const emptyPage = buildPaginatedList(undefined, []);
    const service = new PcirnHomeDataService(
      { findTop: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
      { search: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
    );

    service.metrics.subscribe(metrics => {
      expect(metrics.hasSucceeded).toBeTrue();
      expect(metrics.payload.collections).toBe(PCIRN_COLLECTION_CATEGORIES.length);
      done();
    });
  });

  it('stays pending without payload until every source succeeds', done => {
    const emptyPage = buildPaginatedList(undefined, []);
    const service = new PcirnHomeDataService(
      { findTop: () => createPendingRemoteDataObject$() } as any,
      { search: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
    );

    service.metrics.subscribe(metrics => {
      expect(metrics.hasSucceeded).toBeFalsy();
      expect(metrics.payload).toBeUndefined();
      done();
    });
  });

  it('passes the failure through when one source fails', done => {
    const emptyPage = buildPaginatedList(undefined, []);
    const service = new PcirnHomeDataService(
      { findTop: () => createFailedRemoteDataObject$('communities unavailable') } as any,
      { search: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
    );

    service.metrics.subscribe(metrics => {
      expect(metrics.hasFailed).toBeTrue();
      expect(metrics.payload).toBeUndefined();
      done();
    });
  });
});
