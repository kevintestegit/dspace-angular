import { AsyncPipe } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import {
  combineLatest,
  Observable,
  of,
} from 'rxjs';
import {
  catchError,
  map,
  shareReplay,
  switchMap,
  take,
} from 'rxjs/operators';

import { AuthService } from '../../../../../app/core/auth/auth.service';
import { RequestParam } from '../../../../../app/core/cache/models/request-param.model';
import { FindListOptions } from '../../../../../app/core/data/find-list-options.model';
import { PaginatedList } from '../../../../../app/core/data/paginated-list.model';
import { RemoteData } from '../../../../../app/core/data/remote-data';
import { getFirstCompletedRemoteData } from '../../../../../app/core/shared/operators';
import { ClaimedTaskDataService } from '../../../../../app/core/tasks/claimed-task-data.service';
import { PoolTaskDataService } from '../../../../../app/core/tasks/pool-task-data.service';

/**
 * Number of workflow tasks the current user can act on.
 */
export interface PcirnWorkflowTaskSummary {
  pool: number;
  claimed: number;
  total: number;
}

@Component({
  selector: 'ds-pcirn-workflow-task-summary',
  styleUrls: ['./pcirn-workflow-task-summary.component.scss'],
  templateUrl: './pcirn-workflow-task-summary.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    AsyncPipe,
    RouterLink,
    TranslateModule,
  ],
})
/**
 * Banner shown on MyDSpace when the logged in user has workflow tasks waiting
 * for review. It tells the reviewer how much work is pending and links straight
 * to the workflow configuration of MyDSpace.
 */
export class PcirnWorkflowTaskSummaryComponent implements OnInit {

  /**
   * Pool and claimed task counts of the current user.
   */
  summary$: Observable<PcirnWorkflowTaskSummary>;

  constructor(private authService: AuthService,
              private poolTaskDataService: PoolTaskDataService,
              private claimedTaskDataService: ClaimedTaskDataService) {
  }

  ngOnInit(): void {
    this.summary$ = this.authService.getAuthenticatedUserFromStore().pipe(
      take(1),
      switchMap((user) => {
        if (!user?.uuid) {
          return of({ pool: 0, claimed: 0, total: 0 });
        }
        return combineLatest([
          this.countTasks(this.poolTaskDataService, user.uuid),
          this.countTasks(this.claimedTaskDataService, user.uuid),
        ]).pipe(
          map(([pool, claimed]) => ({ pool, claimed, total: pool + claimed })),
        );
      }),
      catchError(() => of({ pool: 0, claimed: 0, total: 0 })),
      shareReplay(1),
    );
  }

  private countTasks(service: PoolTaskDataService | ClaimedTaskDataService, uuid: string): Observable<number> {
    const options = new FindListOptions();
    options.elementsPerPage = 1;
    options.searchParams = [new RequestParam('uuid', uuid)];
    return service.searchBy('findByUser', options).pipe(
      getFirstCompletedRemoteData(),
      map((remoteData: RemoteData<PaginatedList<unknown>>) =>
        remoteData.hasSucceeded ? (remoteData.payload?.totalElements ?? 0) : 0),
      catchError(() => of(0)),
    );
  }
}
