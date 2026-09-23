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

import { CollectionListPageComponent as BaseComponent } from '../../../../app/collection-list-page/collection-list-page.component';
import { CollectionDataService } from '../../../../app/core/data/collection-data.service';
import { CommunityDataService } from '../../../../app/core/data/community-data.service';
import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { Collection } from '../../../../app/core/shared/collection.model';
import { getFirstSucceededRemoteData } from '../../../../app/core/shared/operators';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';

export function getCollectionIcon(name: string): string {
  const n = normalizeSearchTerm(name);
  if (n.includes('nugecid')) return 'fa-box-archive';
  if (n.includes('portaria') || n.includes('ato normativo')) return 'fa-file-signature';
  if (n.includes('tanatologia') || n.includes('traumatologia')) return 'fa-user-injured';
  if (n.includes('sexologia') || n.includes('odontologia')) return 'fa-tooth';
  if (n.includes('antropologia') || n.includes('arqueologia') || n.includes('psiquiatria') || n.includes('psicologia')) return 'fa-brain';
  if (n.includes('papiloscopia') || n.includes('biometria') || n.includes('necropapiloscopia')) return 'fa-fingerprint';
  if (n.includes('abis') || n.includes('cin')) return 'fa-computer';
  if (n.includes('diretriz') || n.includes('identificacao civil')) return 'fa-id-card';
  if (n.includes('laboratorio')) return 'fa-flask-vial';
  if (n.includes('pericias internas')) return 'fa-building';
  if (n.includes('pericias externas')) return 'fa-map-location-dot';
  if (n.includes('cadeia de custodia') || n.includes('coleta')) return 'fa-link';
  if (n.includes('produtividade pericial') || n.includes('relatorio setorial')) return 'fa-clipboard-list';
  if (n.includes('prestacao de contas') || n.includes('produtividade')) return 'fa-chart-column';
  if (n.includes('planejamento estrategico') || n.includes('gestao')) return 'fa-briefcase';
  if (n.includes('protocolo') || n.includes('exame medico')) return 'fa-stethoscope';
  if (n.includes('manual') || n.includes('guia')) return 'fa-book-open';
  if (n.includes('nota')) return 'fa-note-sticky';
  if (n.includes('pop')) return 'fa-flask-vial';
  return 'fa-folder-open';
}

export interface PcirnCollectionCard {
  collection: Collection;
  icon: string;
  name: string;
  communityName: string;
}

export function normalizeSearchTerm(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterCollectionCards(cards: PcirnCollectionCard[], term: string): PcirnCollectionCard[] {
  const needle = normalizeSearchTerm(term);
  if (needle.length === 0) {
    return cards;
  }
  return cards.filter(card =>
    normalizeSearchTerm(card.name).includes(needle) ||
    normalizeSearchTerm(card.collection.shortDescription ?? '').includes(needle));
}

@Component({
  selector: 'ds-themed-collection-list-page',
  templateUrl: './collection-list-page.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    RouterLink,
    ThemedLoadingComponent,
    TranslateModule,
  ],
})
export class CollectionListPageComponent extends BaseComponent {
  private readonly collectionDataService = inject(CollectionDataService);
  private readonly communityDataService = inject(CommunityDataService);
  private readonly dsoNameService = inject(DSONameService);
  private readonly pageSize = inject(APP_CONFIG).communityList.pageSize;

  protected readonly query = signal('');
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  private readonly collections = signal<Collection[]>([]);
  private readonly communityNames = signal<Map<string, string>>(new Map());

  protected readonly cards = computed<PcirnCollectionCard[]>(() =>
    this.collections()
      .map((collection) => {
        const name = this.dsoNameService.getName(collection);
        return {
          collection,
          icon: getCollectionIcon(name),
          name,
          communityName: this.resolveCommunityName(collection),
        };
      })
      .sort((a, b) => a.communityName.localeCompare(b.communityName, 'pt-BR') || a.name.localeCompare(b.name, 'pt-BR')));
  protected readonly results = computed(() => filterCollectionCards(this.cards(), this.query()));

  constructor() {
    super();
    this.fetchCollections(1, []).pipe(
      switchMap((collections) => this.resolveCommunityNames(collections).pipe(
        map((communityNames) => ({ collections, communityNames })),
      )),
      catchError(() => {
        this.failed.set(true);
        this.loading.set(false);
        return EMPTY;
      }),
    ).subscribe(({ collections, communityNames }) => {
      this.communityNames.set(communityNames);
      this.collections.set(collections);
      this.loading.set(false);
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
  }

  private resolveCommunityName(collection: Collection): string {
    return this.communityNames().get(collection.uuid) ?? '';
  }

  private resolveCommunityNames(collections: Collection[]): Observable<Map<string, string>> {
    const lookups = collections
      .map((collection) => ({ uuid: collection.uuid, href: collection._links?.parentCommunity?.href }))
      .filter((lookup): lookup is { uuid: string; href: string } => !!lookup.href);
    if (lookups.length === 0) {
      return of(new Map<string, string>());
    }
    return forkJoin(lookups.map(({ uuid, href }) =>
      this.communityDataService.findByHref(href).pipe(
        getFirstSucceededRemoteData(),
        map((remoteData): [string, string] => [uuid, this.dsoNameService.getName(remoteData.payload)]),
        catchError(() => of(null)),
      ),
    )).pipe(
      map((entries) => new Map(entries.filter((entry): entry is [string, string] => entry !== null))),
    );
  }

  private fetchCollections(currentPage: number, collected: Collection[]): Observable<Collection[]> {
    return this.collectionDataService.findAll({
      currentPage,
      elementsPerPage: this.pageSize,
    }).pipe(
      getFirstSucceededRemoteData(),
      switchMap((remoteData) => {
        const page = remoteData.payload;
        const collections = [...collected, ...page.page];
        return page.currentPage < page.totalPages
          ? this.fetchCollections(page.currentPage + 1, collections)
          : of(collections);
      }),
    );
  }
}
