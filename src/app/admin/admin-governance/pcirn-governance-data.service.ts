import { HttpHeaders } from '@angular/common/http';
import {
  Inject,
  Injectable,
} from '@angular/core';
import { Observable } from 'rxjs';

import {
  APP_CONFIG,
  AppConfig,
} from '../../../config/app-config.interface';
import { RestRequestMethod } from '../../core/data/rest-request-method';
import { DspaceRestService } from '../../core/dspace-rest/dspace-rest.service';
import { RawRestResponse } from '../../core/dspace-rest/raw-rest-response.model';

export interface GovernanceGroup {
  uuid: string;
  name: string;
  memberCount: number;
}

export interface GovernanceCollection {
  uuid: string;
  name: string;
  handle: string;
  publishGroup?: GovernanceGroup;
}

export interface GovernanceCommunity {
  uuid: string;
  name: string;
  handle: string;
  accessMode: string;
  sectorGroup?: GovernanceGroup;
  collections: GovernanceCollection[];
}

export interface Governance {
  communities: GovernanceCommunity[];
  curationGroup?: GovernanceGroup;
}

export interface GovernanceMember {
  uuid: string;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class PcirnGovernanceDataService {

  private readonly restUrl: string;

  constructor(@Inject(APP_CONFIG) appConfig: AppConfig, private restService: DspaceRestService) {
    this.restUrl = `${appConfig.rest.baseUrl}`;
  }

  getGovernance(): Observable<RawRestResponse> {
    return this.restService.get(`${this.restUrl}/pcirn/governance`);
  }

  setCommunityAccess(communityUuid: string, mode: string, sectorGroup?: string): Observable<RawRestResponse> {
    return this.restService.request(
      RestRequestMethod.PUT,
      `${this.restUrl}/pcirn/governance/communities/${communityUuid}/access`,
      { mode, sectorGroup },
    );
  }

  bindCollectionSector(collectionUuid: string, sectorGroup: string): Observable<RawRestResponse> {
    return this.restService.request(
      RestRequestMethod.PUT,
      `${this.restUrl}/pcirn/governance/collections/${collectionUuid}/sector`,
      { sectorGroup },
    );
  }

  getGroupMembers(groupUuid: string): Observable<RawRestResponse> {
    return this.restService.get(`${this.restUrl}/core/groups/${groupUuid}/epersons?size=100`);
  }

  searchEPersons(query: string): Observable<RawRestResponse> {
    return this.restService.get(
      `${this.restUrl}/core/epersons/search/byMetadata?query=${encodeURIComponent(query)}`,
    );
  }

  searchGroups(query: string): Observable<RawRestResponse> {
    return this.restService.get(
      `${this.restUrl}/core/groups/search/byMetadata?query=${encodeURIComponent(query)}`,
    );
  }

  addGroupMember(groupUuid: string, epersonUuid: string): Observable<RawRestResponse> {
    return this.restService.request(
      RestRequestMethod.POST,
      `${this.restUrl}/core/groups/${groupUuid}/epersons`,
      `${this.restUrl}/core/epersons/${epersonUuid}`,
      { headers: new HttpHeaders({ 'Content-Type': 'text/uri-list' }) },
    );
  }

  removeGroupMember(groupUuid: string, epersonUuid: string): Observable<RawRestResponse> {
    return this.restService.request(
      RestRequestMethod.DELETE,
      `${this.restUrl}/core/groups/${groupUuid}/epersons/${epersonUuid}`,
    );
  }
}
