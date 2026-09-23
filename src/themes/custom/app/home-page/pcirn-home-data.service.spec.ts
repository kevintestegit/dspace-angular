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
      queryParams: { configuration: 'pcirnNormas' },
      requiresLogin: false,
    }));
    expect(cards.find(card => card.title === 'POPs e Procedimentos').queryParams).toBeUndefined();
    expect(cards.find(card => card.title === 'Relatórios Técnicos').queryParams).toBeUndefined();
    expect(cards.filter(card => card.title !== 'Normas e Portarias').every(card => card.requiresLogin)).toBeTrue();
  });

  it('applies the institutional search configuration to every card for authenticated users', () => {
    const cards = buildQuickAccess(true);

    expect(cards.find(card => card.title === 'POPs e Procedimentos').queryParams).toEqual({ configuration: 'pcirnPops' });
    expect(cards.find(card => card.title === 'Produção Científica').queryParams).toEqual({ configuration: 'pcirnProducao' });
    expect(cards.find(card => card.title === 'Relatórios Técnicos').queryParams).toEqual({ configuration: 'pcirnRelatorios' });
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
});
