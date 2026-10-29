import { Injectable } from '@angular/core';
import {
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';

import {
  SortDirection,
  SortOptions,
} from '../../core/cache/models/sort-options.model';
import { CollectionDataService } from '../../core/data/collection-data.service';
import { Collection } from '../../core/shared/collection.model';
import { DSpaceObjectType } from '../../core/shared/dspace-object-type.model';
import { Item } from '../../core/shared/item.model';
import { SearchService } from '../../core/shared/search/search.service';
import { hasValue } from '../../shared/empty.util';
import { PaginationComponentOptions } from '../../shared/pagination/pagination-component-options.model';
import { PaginatedSearchOptions } from '../../shared/search/models/paginated-search-options.model';

export type PcirnLinkDocumentType = 'DOCUMENTO_INSTITUCIONAL' | 'TUTORIAL';

export interface PcirnLinkDocument {
  title: string;
  link: string;
  external: boolean;
}

const COLLECTION_NAME = 'Documentos do NUGECID';
const HTTP_URL = /^https?:\/\//i;

/** Reads the link entries published in the NUGECID collection. */
@Injectable({ providedIn: 'root' })
export class PcirnLinkDocumentsService {
  constructor(
    private collectionDataService: CollectionDataService,
    private searchService: SearchService,
  ) {}

  /**
   * List the published items of the given type, newest first.
   *
   * @param type controlled-vocabulary ID stored in dc.type, used by the tabs
   */
  find(type: PcirnLinkDocumentType): Observable<PcirnLinkDocument[]> {
    return this.collectionDataService.findAll({ elementsPerPage: 100 }).pipe(
      map(rd => rd.payload?.page.find(collection => collection.name === COLLECTION_NAME)),
      filter((collection): collection is Collection => hasValue(collection)),
      switchMap(collection => this.searchService.search<Item>(new PaginatedSearchOptions({
        dsoTypes: [DSpaceObjectType.ITEM],
        scope: collection.uuid,
        query: `dc.type:"${type}"`,
        pagination: Object.assign(new PaginationComponentOptions(), {
          currentPage: 1,
          pageSize: 100,
        }),
        sort: new SortOptions('dc.title', SortDirection.ASC),
      }))),
      map(rd => (rd.payload?.page ?? [])
        .map(result => result.indexableObject)
        .map(item => this.toDocument(item))),
      catchError(() => of([])),
    );
  }

  private toDocument(item: Item): PcirnLinkDocument {
    const metadata = item.metadata ?? {};
    const referencedBy = metadata['dc.relation.isreferencedby']?.[0]?.value?.trim();
    const uri = metadata['dc.identifier.uri']?.find(value => !/\/handle\//i.test(value.value))?.value?.trim();
    const candidate = referencedBy || uri;

    if (candidate && HTTP_URL.test(candidate)) {
      return {
        title: item.name,
        link: candidate,
        external: true,
      };
    }

    return {
      title: item.name,
      link: `/items/${item.uuid}`,
      external: false,
    };
  }
}
