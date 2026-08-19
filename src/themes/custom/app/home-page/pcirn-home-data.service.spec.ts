import { buildPaginatedList } from '../../../../app/core/data/paginated-list.model';
import {
  createFailedRemoteDataObject$,
  createSuccessfulRemoteDataObject$,
} from '../../../../app/shared/remote-data.utils';
import { buildQuickAccess, PcirnHomeDataService } from './pcirn-home-data.service';

describe('buildQuickAccess', () => {
  it('returns four cards with only Portarias public', () => {
    const cards = buildQuickAccess(false);

    expect(cards.length).toBe(4);
    expect(cards.map(card => card.title)).toEqual([
      'Normas e Portarias',
      'POPs e Procedimentos',
      'Produção Científica',
      'Relatórios Técnicos',
    ]);
    expect(cards.find(card => card.title === 'Normas e Portarias')).toEqual(jasmine.objectContaining({
      route: '/search',
      requiresLogin: false,
    }));
    expect(cards.filter(card => card.title !== 'Normas e Portarias').every(card => card.requiresLogin)).toBeTrue();
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
});
