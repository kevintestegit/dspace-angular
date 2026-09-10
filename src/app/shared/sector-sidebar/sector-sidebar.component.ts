import {
  AsyncPipe,
} from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
} from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { DSONameService } from '../../core/breadcrumbs/dso-name.service';
import { Community } from '../../core/shared/community.model';
import { ThemedCreateItemParentSelectorComponent } from '../dso-selector/modal-wrappers/create-item-parent-selector/themed-create-item-parent-selector.component';
import { SectorSidebarService } from './sector-sidebar.service';

@Component({
  selector: 'ds-base-sector-sidebar',
  templateUrl: './sector-sidebar.component.html',
  styleUrls: ['./sector-sidebar.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
export class SectorSidebarComponent {

  constructor(
    public sectorSidebarService: SectorSidebarService,
    public dsoNameService: DSONameService,
    private modalService: NgbModal,
  ) {
  }

  trackCommunity(_: number, community: Community): string {
    return community.id;
  }

  openSubmission(): void {
    this.modalService.open(ThemedCreateItemParentSelectorComponent);
  }
}
