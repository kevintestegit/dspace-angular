import { buildPaginatedList } from '../../../../app/core/data/paginated-list.model';
import {
  createFailedRemoteDataObject$,
  createPendingRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../../app/shared/remote-data.utils';
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
  it('shares collection and search reads used by content and metrics', () => {
    let collectionCalls = 0;
    let searchCalls = 0;
    const emptyPage = buildPaginatedList(undefined, []);

    new PcirnHomeDataService(
      { findTop: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
      {
        findAll: () => {
          collectionCalls++;
          return createSuccessfulRemoteDataObject$(emptyPage);
        },
      } as any,
      {
        search: () => {
          searchCalls++;
          return createSuccessfulRemoteDataObject$(emptyPage);
        },
      } as any,
    );

    expect(collectionCalls).toBe(1);
    expect(searchCalls).toBe(1);
  });

  it('keeps a featured-collection error isolated from latest publications', done => {
    const service = new PcirnHomeDataService(
      { findTop: () => createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, [])) } as any,
      { findAll: () => createFailedRemoteDataObject$('collections unavailable') } as any,
      { search: () => createSuccessfulRemoteDataObject$(buildPaginatedList(undefined, [])) } as any,
    );

    service.featuredCollections.subscribe(featured => {
      expect(featured.hasFailed).toBeTrue();
      service.latestPublications.subscribe(latest => {
        expect(latest.hasSucceeded).toBeTrue();
        done();
      });
    });
  });

  it('stays pending without payload until every source succeeds', done => {
    const emptyPage = buildPaginatedList(undefined, []);
    const service = new PcirnHomeDataService(
      { findTop: () => createPendingRemoteDataObject$() } as any,
      { findAll: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
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
      { findAll: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
      { search: () => createSuccessfulRemoteDataObject$(emptyPage) } as any,
    );

    service.metrics.subscribe(metrics => {
      expect(metrics.hasFailed).toBeTrue();
      expect(metrics.payload).toBeUndefined();
      done();
    });
  });
});
