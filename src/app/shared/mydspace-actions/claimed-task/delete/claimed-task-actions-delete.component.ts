import { AsyncPipe } from '@angular/common';
import {
  Component,
  Injector,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  NgbModal,
  NgbModalRef,
  NgbTooltip,
} from '@ng-bootstrap/ng-bootstrap';
import {
  TranslateModule,
  TranslateService,
} from '@ngx-translate/core';
import {
  Observable,
  of,
} from 'rxjs';

import { RemoteData } from '../../../../core/data/remote-data';
import { RequestService } from '../../../../core/data/request.service';
import { DSpaceObject } from '../../../../core/shared/dspace-object.model';
import { SearchService } from '../../../../core/shared/search/search.service';
import { BtnDisabledDirective } from '../../../btn-disabled.directive';
import { NotificationsService } from '../../../notifications/notifications.service';
import { ClaimedTaskActionsAbstractComponent } from '../abstract/claimed-task-actions-abstract.component';

export const WORKFLOW_TASK_OPTION_DELETE = 'submit_delete';

@Component({
  selector: 'ds-claimed-task-actions-delete',
  styleUrls: ['./claimed-task-actions-delete.component.scss'],
  templateUrl: './claimed-task-actions-delete.component.html',
  imports: [
    AsyncPipe,
    BtnDisabledDirective,
    NgbTooltip,
    TranslateModule,
  ],
})
/**
 * Component for displaying and processing the permanent delete action on a workflow task item.
 * Deleting discards the submission, the item and its files.
 */
export class ClaimedTaskActionsDeleteComponent extends ClaimedTaskActionsAbstractComponent {

  /**
   * Reference to NgbModal
   */
  public modalRef: NgbModalRef;

  constructor(protected injector: Injector,
              protected router: Router,
              protected notificationsService: NotificationsService,
              protected translate: TranslateService,
              protected searchService: SearchService,
              protected requestService: RequestService,
              private modalService: NgbModal) {
    super(injector, router, notificationsService, translate, searchService, requestService);
  }

  /**
   * Submit a delete option for the task
   */
  submitTask() {
    this.modalRef.close('Delete Button');
    super.submitTask();
  }

  /**
   * Open the confirmation modal
   *
   * @param content
   */
  openDeleteModal(content: any) {
    this.modalRef = this.modalService.open(content);
  }

  reloadObjectExecution(): Observable<RemoteData<DSpaceObject> | DSpaceObject> {
    return of(this.object);
  }
}
