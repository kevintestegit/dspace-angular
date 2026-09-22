import { CommonModule } from '@angular/common';
import {
  Component,
  OnInit,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';

import { ThemedCreateCollectionParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-collection-parent-selector/themed-create-collection-parent-selector.component';
import { ThemedCreateCommunityParentSelectorComponent } from '../../shared/dso-selector/modal-wrappers/create-community-parent-selector/themed-create-community-parent-selector.component';
import {
  Governance,
  GovernanceCommunity,
  GovernanceGroup,
  GovernanceMember,
  PcirnGovernanceDataService,
} from './pcirn-governance-data.service';

@Component({
  selector: 'ds-admin-governance',
  templateUrl: './admin-governance.component.html',
  styleUrls: ['./admin-governance.component.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    TranslateModule,
  ],
})
export class AdminGovernanceComponent implements OnInit {

  governance?: Governance;
  loading = true;
  error = false;
  busy = false;
  feedback?: string;

  members: { [groupUuid: string]: GovernanceMember[] } = {};
  personResults: { [groupUuid: string]: GovernanceMember[] } = {};
  personQuery: { [groupUuid: string]: string } = {};
  expandedMembers?: string;

  groupQuery = '';
  groupResults: GovernanceGroup[] = [];
  pickerCommunityUuid?: string;
  pickerCollectionUuid?: string;

  pendingRestrictUuid?: string;
  pendingPublicUuid?: string;

  constructor(
    private governanceService: PcirnGovernanceDataService,
    private modalService: NgbModal,
  ) {
  }

  ngOnInit(): void {
    this.loadGovernance();
  }

  loadGovernance(): void {
    this.loading = true;
    this.error = false;
    this.governanceService.getGovernance().subscribe({
      next: (response) => {
        this.governance = response.statusCode === 200 ? response.payload as Governance : undefined;
        this.loading = false;
      },
      error: () => {
        this.governance = undefined;
        this.error = true;
        this.loading = false;
      },
    });
  }

  editCommunityLink(community: GovernanceCommunity): string {
    return `/communities/${community.uuid}/edit/metadata`;
  }

  editCollectionLink(collectionUuid: string): string {
    return `/collections/${collectionUuid}/edit/metadata`;
  }

  toggleMembers(groupUuid: string): void {
    if (this.expandedMembers === groupUuid) {
      this.expandedMembers = undefined;
      return;
    }
    this.expandedMembers = groupUuid;
    this.loadMembers(groupUuid);
  }

  loadMembers(groupUuid: string): void {
    this.governanceService.getGroupMembers(groupUuid).subscribe({
      next: (response) => {
        this.members[groupUuid] = this.parseEPersons(response.payload);
      },
      error: () => {
        this.members[groupUuid] = [];
      },
    });
  }

  searchPersons(groupUuid: string): void {
    const query = (this.personQuery[groupUuid] || '').trim();
    if (query.length < 3) {
      this.personResults[groupUuid] = [];
      return;
    }
    this.governanceService.searchEPersons(query).subscribe({
      next: (response) => {
        this.personResults[groupUuid] = this.parseEPersons(response.payload);
      },
      error: () => {
        this.personResults[groupUuid] = [];
      },
    });
  }

  addMember(groupUuid: string, member: GovernanceMember): void {
    this.busy = true;
    this.governanceService.addGroupMember(groupUuid, member.uuid).subscribe({
      next: () => {
        this.personQuery[groupUuid] = '';
        this.personResults[groupUuid] = [];
        this.loadMembers(groupUuid);
        this.refreshCounts();
        this.feedback = 'admin.governance.feedback.member-added';
        this.busy = false;
      },
      error: () => {
        this.feedback = 'admin.governance.feedback.error';
        this.busy = false;
      },
    });
  }

  removeMember(groupUuid: string, member: GovernanceMember): void {
    this.busy = true;
    this.governanceService.removeGroupMember(groupUuid, member.uuid).subscribe({
      next: () => {
        this.loadMembers(groupUuid);
        this.refreshCounts();
        this.feedback = 'admin.governance.feedback.member-removed';
        this.busy = false;
      },
      error: () => {
        this.feedback = 'admin.governance.feedback.error';
        this.busy = false;
      },
    });
  }

  startRestrict(community: GovernanceCommunity): void {
    this.pendingRestrictUuid = community.uuid;
    this.pendingPublicUuid = undefined;
    if (!community.sectorGroup) {
      this.pickerCommunityUuid = community.uuid;
      this.groupQuery = '';
      this.groupResults = [];
    }
  }

  confirmRestrict(community: GovernanceCommunity): void {
    const sectorGroup = community.sectorGroup ? community.sectorGroup.uuid : this.selectedGroupUuid();
    if (!sectorGroup) {
      return;
    }
    this.applyAccess(community.uuid, 'restricted', sectorGroup);
  }

  startPublic(community: GovernanceCommunity): void {
    this.pendingPublicUuid = community.uuid;
    this.pendingRestrictUuid = undefined;
  }

  confirmPublic(community: GovernanceCommunity): void {
    this.applyAccess(community.uuid, 'public');
  }

  cancelPending(): void {
    this.pendingRestrictUuid = undefined;
    this.pendingPublicUuid = undefined;
    this.pickerCommunityUuid = undefined;
    this.pickerCollectionUuid = undefined;
  }

  searchGroups(): void {
    const query = (this.groupQuery || '').trim();
    if (query.length < 3) {
      this.groupResults = [];
      return;
    }
    this.governanceService.searchGroups(query).subscribe({
      next: (response) => {
        const groups = response.payload?._embedded?.groups || [];
        this.groupResults = groups.map((group: any) => ({
          uuid: group.uuid,
          name: group.name,
          memberCount: 0,
        }));
      },
      error: () => {
        this.groupResults = [];
      },
    });
  }

  selectedGroupUuid(): string | undefined {
    return this.groupResults[0]?.uuid;
  }

  pickGroup(group: GovernanceGroup): void {
    if (this.pickerCommunityUuid) {
      this.pickerCommunityUuid = undefined;
      this.applyAccess(this.pendingRestrictUuid, 'restricted', group.uuid);
    } else if (this.pickerCollectionUuid) {
      const collectionUuid = this.pickerCollectionUuid;
      this.pickerCollectionUuid = undefined;
      this.bindCollection(collectionUuid, group.uuid);
    }
  }

  startBindCollection(collectionUuid: string): void {
    this.pickerCollectionUuid = collectionUuid;
    this.groupQuery = '';
    this.groupResults = [];
  }

  bindCollection(collectionUuid: string, groupUuid: string): void {
    this.busy = true;
    this.governanceService.bindCollectionSector(collectionUuid, groupUuid).subscribe({
      next: () => {
        this.loadGovernance();
        this.feedback = 'admin.governance.feedback.saved';
        this.busy = false;
      },
      error: () => {
        this.feedback = 'admin.governance.feedback.error';
        this.busy = false;
      },
    });
  }

  openCreateCommunity(): void {
    this.modalService.open(ThemedCreateCommunityParentSelectorComponent);
  }

  openCreateCollection(): void {
    this.modalService.open(ThemedCreateCollectionParentSelectorComponent);
  }

  private applyAccess(communityUuid: string, mode: string, sectorGroup?: string): void {
    this.busy = true;
    this.governanceService.setCommunityAccess(communityUuid, mode, sectorGroup).subscribe({
      next: () => {
        this.cancelPending();
        this.loadGovernance();
        this.feedback = 'admin.governance.feedback.saved';
        this.busy = false;
      },
      error: () => {
        this.feedback = 'admin.governance.feedback.error';
        this.busy = false;
      },
    });
  }

  private refreshCounts(): void {
    this.governanceService.getGovernance().subscribe({
      next: (response) => {
        if (response.statusCode === 200) {
          this.governance = response.payload as Governance;
        }
      },
    });
  }

  private parseEPersons(payload: any): GovernanceMember[] {
    const epersons = payload?._embedded?.epersons || [];
    return epersons.map((eperson: any) => ({
      uuid: eperson.uuid,
      name: eperson.name,
      email: eperson.email,
    }));
  }
}
