import { Injectable } from '@angular/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  distinctUntilChanged,
  map,
  shareReplay,
  switchMap,
} from 'rxjs/operators';

import { AuthService } from '../../core/auth/auth.service';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { PaginatedList } from '../../core/data/paginated-list.model';
import { RemoteData } from '../../core/data/remote-data';
import { Collection } from '../../core/shared/collection.model';
import { Community } from '../../core/shared/community.model';
import { getFirstSucceededRemoteDataPayload } from '../../core/shared/operators';
import { followLink } from '../utils/follow-link-config.model';

@Injectable({ providedIn: 'root' })
export class UserSectorsService {

  readonly communities$: Observable<Community[]>;
  readonly canSubmit$: Observable<boolean>;

  constructor(
    private authService: AuthService,
    private collectionDataService: CollectionDataService,
  ) {
    const authenticated$ = this.authService.isAuthenticated().pipe(
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    const collectionsRD$: Observable<RemoteData<PaginatedList<Collection>>> = authenticated$.pipe(
      switchMap((authenticated) => authenticated
        ? this.collectionDataService.getSubmitAuthorizedCollection(
          '',
          { currentPage: 1, elementsPerPage: 50 },
          true,
          true,
          followLink('parentCommunity'),
        )
        : of(undefined)),
      shareReplay({ bufferSize: 1, refCount: true }),
    );

    this.communities$ = collectionsRD$.pipe(
      switchMap((collectionsRD) => {
        const collections = collectionsRD?.hasSucceeded ? collectionsRD.payload.page : [];
        if (collections.length === 0) {
          return of([]);
        }
        return combineLatest(collections.map((collection) =>
          collection.parentCommunity?.pipe(getFirstSucceededRemoteDataPayload()) ?? of(undefined),
        )).pipe(
          map((communities) => communities
            .filter((community): community is Community => community !== undefined)
            .reduce((uniqueCommunities, community) => uniqueCommunities.some((item) => item.id === community.id)
              ? uniqueCommunities
              : [...uniqueCommunities, community], [] as Community[])),
        );
      }),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
    this.canSubmit$ = this.communities$.pipe(
      map((communities) => communities.length > 0),
      shareReplay({ bufferSize: 1, refCount: true }),
    );
  }
}
