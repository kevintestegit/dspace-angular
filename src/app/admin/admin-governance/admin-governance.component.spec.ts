import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { TranslateModule } from '@ngx-translate/core';
import {
  of,
  throwError,
} from 'rxjs';

import { RawRestResponse } from '../../core/dspace-rest/raw-rest-response.model';
import { AdminGovernanceComponent } from './admin-governance.component';
import { PcirnGovernanceDataService } from './pcirn-governance-data.service';

describe('AdminGovernanceComponent', () => {
  let fixture: ComponentFixture<AdminGovernanceComponent>;
  let governanceService: jasmine.SpyObj<PcirnGovernanceDataService>;

  const governancePayload = {
    communities: [{
      uuid: 'community-1',
      name: 'Instituto de Criminalística',
      handle: '123456789/4',
      accessMode: 'public',
      sectorGroup: { uuid: 'sector-1', name: 'PCIRN_Setor_IC', memberCount: 2 },
      collections: [{
        uuid: 'collection-1',
        name: 'Portarias',
        handle: '123456789/7',
        publishGroup: { uuid: 'sector-1', name: 'PCIRN_Setor_IC', memberCount: 2 },
      }],
    }],
    curationGroup: { uuid: 'curation-1', name: 'NUGECID', memberCount: 2 },
  };

  beforeEach(async () => {
    governanceService = jasmine.createSpyObj<PcirnGovernanceDataService>('PcirnGovernanceDataService', [
      'getGovernance',
      'setCommunityAccess',
      'bindCollectionSector',
      'getGroupMembers',
      'searchEPersons',
      'searchGroups',
      'addGroupMember',
      'removeGroupMember',
    ]);
    governanceService.getGovernance.and.returnValue(of({
      statusCode: 200,
      statusText: 'OK',
      payload: governancePayload,
    } as RawRestResponse));
    governanceService.setCommunityAccess.and.returnValue(of({
      statusCode: 200,
      statusText: 'OK',
      payload: {},
    } as RawRestResponse));
    governanceService.getGroupMembers.and.returnValue(of({
      statusCode: 200,
      statusText: 'OK',
      payload: { _embedded: { epersons: [] } },
    } as RawRestResponse));
    governanceService.searchEPersons.and.returnValue(of({
      statusCode: 200,
      statusText: 'OK',
      payload: {
        _embedded: {
          epersons: [{ uuid: 'person-1', name: 'Kevin', email: 'kevin@example.org' }],
        },
      },
    } as RawRestResponse));
    governanceService.addGroupMember.and.returnValue(of({
      statusCode: 200,
      statusText: 'OK',
      payload: {},
    } as RawRestResponse));

    await TestBed.configureTestingModule({
      imports: [AdminGovernanceComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([]),
        { provide: PcirnGovernanceDataService, useValue: governanceService },
        { provide: NgbModal, useValue: jasmine.createSpyObj('NgbModal', ['open']) },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminGovernanceComponent);
    fixture.detectChanges();
  });

  it('renders communities, collections and the curation group', () => {
    const text = fixture.nativeElement.textContent;
    expect(text).toContain('Instituto de Criminalística');
    expect(text).toContain('Portarias');
    expect(text).toContain('NUGECID');
    expect(fixture.nativeElement.querySelector('[data-test="access-mode"]')).toBeTruthy();
    expect(fixture.nativeElement.querySelectorAll('[data-test="collection"]').length).toBe(1);
  });

  it('restricts a community with its sector group', () => {
    const restrict: HTMLButtonElement = fixture.nativeElement.querySelector('[data-test="restrict"]');
    restrict.click();
    fixture.detectChanges();

    const confirm: HTMLButtonElement = fixture.nativeElement.querySelector('[data-test="confirm-restrict"]');
    expect(confirm).toBeTruthy();
    confirm.click();
    fixture.detectChanges();

    expect(governanceService.setCommunityAccess).toHaveBeenCalledWith('community-1', 'restricted', 'sector-1');
  });

  it('adds a member to a group', () => {
    const members: HTMLButtonElement = fixture.nativeElement.querySelector('[data-test="members"]');
    members.click();
    fixture.detectChanges();

    const input: HTMLInputElement = fixture.nativeElement.querySelector('[data-test="person-query"]');
    input.value = 'kevin';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    const add: HTMLButtonElement = fixture.nativeElement.querySelector('[data-test="add-member"]');
    expect(add).toBeTruthy();
    add.click();
    fixture.detectChanges();

    expect(governanceService.addGroupMember).toHaveBeenCalledWith('sector-1', 'person-1');
  });

  it('renders the error state', () => {
    governanceService.getGovernance.and.returnValue(throwError(() => new Error('boom')));
    fixture = TestBed.createComponent(AdminGovernanceComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-test="error"]')).toBeTruthy();
  });
});
