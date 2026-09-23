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
  Observable,
  of,
  switchMap,
} from 'rxjs';
import { APP_CONFIG } from 'src/config/app-config.interface';

import { CommunityListPageComponent as BaseComponent } from '../../../../app/community-list-page/community-list-page.component';
import { DSONameService } from '../../../../app/core/breadcrumbs/dso-name.service';
import { CommunityDataService } from '../../../../app/core/data/community-data.service';
import { Community } from '../../../../app/core/shared/community.model';
import { getFirstSucceededRemoteData } from '../../../../app/core/shared/operators';
import { ThemedLoadingComponent } from '../../../../app/shared/loading/themed-loading.component';

export function getCommunityIcon(name: string): string {
  const n = normalizeSearchTerm(name);
  if (n.includes('criminalistica')) return 'fa-microscope';
  if (n.includes('identificacao') || n.includes('(ii)')) return 'fa-fingerprint';
  if (n.includes('medicina legal') || n.includes('(iml)')) return 'fa-dna';
  if (n.includes('nugecid') || n.includes('memoria') || n.includes('conhecimento')) return 'fa-box-archive';
  if (n.includes('gestao') || n.includes('(dg)')) return 'fa-building-columns';
  return 'fa-file-lines';
}

export interface PcirnCommunityCard {
  community: Community;
  icon: string;
  name: string;
}

export function normalizeSearchTerm(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
}

export function filterCommunityCards(cards: PcirnCommunityCard[], term: string): PcirnCommunityCard[] {
  const needle = normalizeSearchTerm(term);
  if (needle.length === 0) {
    return cards;
  }
  return cards.filter(card =>
    normalizeSearchTerm(card.name).includes(needle) ||
    normalizeSearchTerm(card.community.shortDescription ?? '').includes(needle));
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
  private readonly dsoNameService = inject(DSONameService);
  private readonly pageSize = inject(APP_CONFIG).communityList.pageSize;

  protected readonly query = signal('');
  protected readonly loading = signal(true);
  protected readonly failed = signal(false);
  private readonly communities = signal<Community[]>([]);

  protected readonly cards = computed<PcirnCommunityCard[]>(() =>
    this.communities().map((community) => {
      const name = this.dsoNameService.getName(community);
      return {
        community,
        icon: getCommunityIcon(name),
        name,
      };
    }));
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
    });
  }

  protected onSearch(event: Event): void {
    this.query.set((event.target as HTMLInputElement).value);
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
